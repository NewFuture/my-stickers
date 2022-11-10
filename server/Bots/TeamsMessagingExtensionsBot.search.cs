// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

namespace Stickers.Bot;

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Newtonsoft.Json.Linq;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Resources;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{
    /// <summary>
    /// Query Settings
    /// </summary>
    /// <param name="turnContext"></param>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionConfigurationQuerySettingUrlAsync(
        ITurnContext<IInvokeActivity> turnContext,
        MessagingExtensionQuery query,
        CancellationToken cancellationToken
    )
    {
        var userId = turnContext.Activity?.From?.AadObjectId;
        return await Task.FromResult(
            new MessagingExtensionResponse
            {
                ComposeExtension = new MessagingExtensionResult
                {
                    Type = "config",
                    SuggestedActions = new MessagingExtensionSuggestedAction
                    {
                        Actions = new List<CardAction>
                        {
                            new CardAction
                            {
                                Type = "openApp",
                                Title = LocalizationHelper.LookupString(
                                    "upload_task_module_title",
                                    turnContext.Activity.GetLocale()
                                ),
                                Value = this.GetConfigUrl(Guid.Parse(userId!))
                            }
                        }
                    }
                }
            }
        );
    }

    /// <summary>
    /// Search
    /// </summary>
    /// <param name="turnContext"></param>
    /// <param name="query"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(
        ITurnContext<IInvokeActivity> turnContext,
        MessagingExtensionQuery query,
        CancellationToken cancellationToken
    )
    {
        var userId = Guid.Parse(turnContext.Activity.From.AadObjectId);
        var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
        var skip = query.QueryOptions.Skip ?? 0;
        var count = query.QueryOptions.Count ?? 30;
        var initialRun = GetQueryParameters(query, "initialRun");

        cancellationToken.ThrowIfCancellationRequested();
        if (initialRun == "true")
        {
            var imgs = await this.InitialResultGrid(
                userId,
                tenantId,
                skip,
                count,
                cancellationToken
            );
            return GetMessagingExtensionResponse(imgs, false);
        }
        else
        {
            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            var keyword = GetQueryParameters(query, "query");
            var imgs = await this.QueryResultGrid(
                userId,
                tenantId,
                keyword,
                skip,
                count,
                cancellationToken
            );
            return GetMessagingExtensionResponse(imgs, true);
        }
    }

    /// <summary>
    /// show more list in init Run.
    /// Get User List , Tenant List and Official List to warm up.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="tenantId"></param>
    /// <param name="skip"></param>
    /// <param name="count"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<IEnumerable<Img>> InitialResultGrid(
        Guid userId,
        Guid tenantId,
        int skip,
        int count,
        CancellationToken cancellationToken
    )
    {
        // user search
        var usetStikcerTask = this.searchService.SearchUserStickers(
            userId,
            null,
            cancellationToken
        );
        var tenantStickersTask = this.searchService.SearchTenantStickers(
            tenantId,
            null,
            cancellationToken
        );
        cancellationToken.ThrowIfCancellationRequested();
        var stickers = await usetStikcerTask;
        if (stickers.Count < skip + count)
        {
            // tenant
            var tenantStickers = await tenantStickersTask;
            stickers = stickers.Concat(tenantStickers).ToList();
        }

        IEnumerable<Img> imgs = Array.Empty<Img>();
        if (stickers.Count > skip)
        {
            imgs = stickers.Skip(skip).Select(StickerToImg);
        }

        if (stickers.Count < skip + count)
        {
            cancellationToken.ThrowIfCancellationRequested();
            // official images
            var officialStickers = this.searchService.SearchOfficialStickers(null);
            var officialImgs = officialStickers
                .Take(skip + count - stickers.Count)
                .Select(os => new Img(this.WebUrl + os.url, os.name));
            imgs = imgs.Concat(officialImgs);
        }
        return imgs;
    }

    private async Task<IEnumerable<Img>> QueryResultGrid(
        Guid userId,
        Guid tenantId,
        string? keyword,
        int skip,
        int count,
        CancellationToken cancellationToken
    )
    {
        if (skip > 0)
        {
            // search 最多支持一页
            return Array.Empty<Img>();
        }
        // user search
        var stickers = await this.searchService.SearchUserStickers(
            userId,
            keyword,
            cancellationToken
        );
        if (count > stickers.Count)
        {
            var tenantStickers = await this.searchService.SearchTenantStickers(
                tenantId,
                keyword,
                cancellationToken
            );
            stickers = stickers.Concat(tenantStickers).ToList();
        }
        if (count <= stickers.Count)
        {
            var imgs = stickers.Take(count).Select(StickerToImg);
            return imgs;
        }

        cancellationToken.ThrowIfCancellationRequested();
        // official search
        var officialStickers = this.searchService.SearchOfficialStickers(keyword);
        var allimgs = stickers.Select(StickerToImg);
        var officialImgs = officialStickers
            .Take(count - stickers.Count)
            .Select(os => new Img(this.WebUrl + os.url, os.name));
        return allimgs.Concat(officialImgs);
    }

    public static MessagingExtensionResponse GetMessagingExtensionResponse(
        IEnumerable<Img> images,
        bool isSearch
    )
    {
        IList<MessagingExtensionAttachment> attachments = images
            .Select(
                img =>
                    new MessagingExtensionAttachment(
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: GetAdaptiveCard(img),
                        preview: new Attachment(
                            contentType: "application/vnd.microsoft.card.thumbnail",
                            content: new ThumbnailCard(
                                images: new[] { new CardImage(img.Src, img.Alt) }
                            )
                        )
                    )
            )
            .ToArray();

        return new MessagingExtensionResponse
        {
            ComposeExtension = new MessagingExtensionResult("grid", "result", attachments),
            CacheInfo = new CacheInfo("CACHE", isSearch ? 600 : 120),
        };
    }

    private static string? GetQueryParameters(MessagingExtensionQuery query, string name)
    {
        return query.Parameters?.SingleOrDefault(q => q.Name.Equals(name))?.Value.ToString();
    }

    private static Img StickerToImg(Sticker s)
    {
        return new Img(s.src ?? "", s.name);
    }

    private static JObject GetAdaptiveCard(Img img)
    {
        return JObject.FromObject(
            new
            {
                type = "AdaptiveCard",
                version = "1.5",
                minHeight = "150px",
                verticalContentAlignment = "center",
                body = new[]
                {
                    new
                    {
                        type = "Image",
                        altText = img.Alt,
                        horizontalAlignment = "center",
                        url = img.Src,
                        height = "auto",
                        msTeams = new { allowExpand = true, },
                    }
                }
            }
        );
    }
}
