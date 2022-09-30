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

        /// <summary>
        /// Query Settings
        /// </summary>
        /// <param name="turnContext"></param>
        /// <param name="query"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Search
        /// </summary>
        /// <param name="turnContext"></param>
        /// <param name="query"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(turnContext.Activity.From.AadObjectId);
            var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
            var skip = query.QueryOptions.Skip ?? 0;
            var count = query.QueryOptions.Count ?? 30;
            var initialRun = this.GetQueryParameters(query, "initialRun");

            if (initialRun == "true")
            {
                var imgs = await InitialResultGrid(userId, tenantId, skip, count);
                return GetMessagingExtensionResponse(imgs, false);
            }
            else
            {
                // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
                var keyword = this.GetQueryParameters(query, "query");
                var imgs = await QueryResultGrid(userId, tenantId, keyword, skip, count);
                return GetMessagingExtensionResponse(imgs, true);
            }
        }

        // show more list in init Run
        private async Task<IEnumerable<Img>> InitialResultGrid(Guid userId, Guid tenantId, int skip, int count)
        {
            // user search
            var stickers = await this.searchService.SearchUserStickers(userId, null);
            if (stickers.Count < skip + count)
            {
                // tenant
                var tenantStickers = await this.searchService.SearchTenantStickers(tenantId, null);
                stickers = stickers.Concat(tenantStickers).ToList();
            }

            IEnumerable<Img> imgs = new Img[] { };
            if (stickers.Count > skip)
            {
                imgs = stickers.Skip(skip).Select(StickerToImg);
            }
            if (stickers.Count < skip + count)
            {
                // official images
                var officialStickers = await this.searchService.SearchOfficialStickers(null);
                var officialImgs = officialStickers.Take(skip + count - stickers.Count).Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                imgs = imgs.Concat(officialImgs);
            }
            return imgs;
        }

        private async Task<IEnumerable<Img>> QueryResultGrid(Guid userId, Guid tenantId, string? keyword, int skip, int count)
        {
            if (skip > 0)
            {
                // search 最多支持一页
                return new Img[0];
            }
            // user search
            var stickers = await this.searchService.SearchUserStickers(userId, keyword);
            if (count > stickers.Count)
            {
                var tenantStickers = await this.searchService.SearchTenantStickers(tenantId, keyword);
                stickers = stickers.Concat(tenantStickers).ToList();
            }
            if (count <= stickers.Count)
            {
                var imgs = stickers.Take(count).Select(StickerToImg);
                return imgs;
            }

            // official search
            var officialStickers = await this.searchService.SearchOfficialStickers(keyword);
            var allimgs = stickers.Select(StickerToImg);
            var officialImgs = officialStickers.Take(count - stickers.Count)
            .Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
            return allimgs.Concat(officialImgs);
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
