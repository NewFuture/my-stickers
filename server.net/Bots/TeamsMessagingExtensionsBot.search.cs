// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Stickers.Models;
using Stickers.Entities;
using Stickers.Resources;

namespace Stickers.Bot
{

    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {

        protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionConfigurationQuerySettingUrlAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
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
                               Title = LocalizationHelper.LookupString("upload_task_module_title", GetCultureInfoFromBotActivity(turnContext.Activity)),
                               Value = this.GetConfigUrl(Guid.Parse(userId!))
                           }
                       }
                        }
                    }
                });
        }

        protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(turnContext.Activity.From.AadObjectId);
            var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
            var skip = query.QueryOptions.Skip ?? 0;
            var count = query.QueryOptions.Count ?? 30;
            var initialRun = this.GetQueryParameters(query, "initialRun");

            if (initialRun == "true")
            {
                return await InitialResultGrid(userId, tenantId, skip, skip == 0 ? 120 : count);
            }
            // var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

            // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
            // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            var keyword = this.GetQueryParameters(query, "query");
            return await QueryResultGrid(userId, tenantId, keyword, skip, count);
        }

        // show more list in init Run
        private async Task<MessagingExtensionResponse> InitialResultGrid(Guid userId, Guid tenantId, int skip, int count)
        {
            // user search
            var stickers = await searchService.SearchUserStickers(userId, null);
            if (stickers.Count < skip + count)
            {
                // tenant
                var tenantStickers = await searchService.SearchTenantStickers(tenantId, null);
                stickers = stickers.Concat(tenantStickers).ToList();
            }

            IEnumerable<Img> imgs = new Img[] { };
            if (stickers.Count > skip)
            {
                imgs = stickers.GetRange(skip, stickers.Count).Select(StickerToImg);
            }
            if (stickers.Count < skip + count)
            {
                // official images
                var officialStickers = await searchService.SearchOfficialStickers(null);
                var officialImgs = officialStickers.GetRange(0, skip + count - stickers.Count).Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                imgs = imgs.Concat(officialImgs);
            }
            return GetMessagingExtensionResponse(imgs, false);
        }



        private async Task<MessagingExtensionResponse> QueryResultGrid(Guid userId, Guid tenantId, string? keyword, int skip, int count)
        {
            if (skip > 0)
            {
                // search 最多支持一页
                return this.GetMessagingExtensionResponse(new Img[0], true);
            }
            // user search
            var stickers = await searchService.SearchUserStickers(userId, keyword);
            if (count > stickers.Count)
            {
                var tenantStickers = await searchService.SearchTenantStickers(tenantId, keyword);
                stickers = stickers.Concat(tenantStickers).ToList();
            }
            if (count <= stickers.Count)
            {
                var imgs = stickers.GetRange(0, count).Select(StickerToImg);
                return GetMessagingExtensionResponse(imgs, true);
            }

            // official search
            var officialStickers = await searchService.SearchOfficialStickers(keyword);
            var allimgs = stickers.Select(StickerToImg);
            var officialImgs = officialStickers.GetRange(0, count - stickers.Count)
            .Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
            return GetMessagingExtensionResponse(allimgs.Concat(officialImgs), true);
        }

        private MessagingExtensionResponse GetMessagingExtensionResponse(IEnumerable<Img> images, Boolean isSearch)
        {
            List<MessagingExtensionAttachment> attachments = images.Select(img => new MessagingExtensionAttachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = this.GetAdaptiveCardJsonObject(img, "StickerCard.json"),
                Preview = new ThumbnailCard()
                {
                    Images = new List<CardImage>() { new CardImage(img.Src) }
                }.ToAttachment()
            }).ToList();

            return new MessagingExtensionResponse
            {
                ComposeExtension = new MessagingExtensionResult("grid", "result", attachments),
                CacheInfo = new CacheInfo("CACHE", isSearch ? 600 : 120),
            };
        }
        private string? GetQueryParameters(MessagingExtensionQuery query, string name)
        {
            return query.Parameters?.SingleOrDefault(q => q.Name.Equals(name))?.Value.ToString();
        }

        private static Img StickerToImg(Sticker s)
        {
            return new Img { Src = s.src, Alt = s.name };
        }

    }
}
