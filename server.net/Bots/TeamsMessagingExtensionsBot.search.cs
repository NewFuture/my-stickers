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
            var initialRun = this.GetQueryParameters(query, "initialRun");

            if (initialRun == "true" && (query.QueryOptions.Skip ?? 0) == 0)
            {
                return await initialResultGrid(turnContext);
            }
            // var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

            // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
            // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            return await QueryResultGrid(turnContext, query);
        }

        // show more list in init Run
        private async Task<MessagingExtensionResponse> initialResultGrid(ITurnContext turnContext)
        {
            var minCount = 60;
            // user search
            var userId = Guid.Parse(turnContext.Activity.From.AadObjectId);
            var stickers = await searchService.SearchUserStickers(userId, null);
            if (stickers.Count < minCount)
            {
                // tenant
                var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
                var tenantStickers = await searchService.SearchTenantStickers(tenantId, null);
                stickers = stickers.Concat(tenantStickers).ToList();
            }

            var imgs = stickers.Select(StickerToImg);
            if (stickers.Count < minCount)
            {
                // official images
                var officialStickers = await searchService.SearchOfficialStickers(null);
                var officialImgs = officialStickers.GetRange(0, minCount - stickers.Count).Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                imgs = imgs.Concat(officialImgs);

            }
            return GetMessagingExtensionResponse(imgs, false);
        }



        private async Task<MessagingExtensionResponse> QueryResultGrid(ITurnContext turnContext, MessagingExtensionQuery query)
        {

            var keyword = this.GetQueryParameters(query, "query");
            var skip = query.QueryOptions.Skip ?? 0;
            var isSearch = !String.IsNullOrWhiteSpace(keyword);
            if (isSearch && skip > 0)
            {
                // search 最多支持一页
                return this.GetMessagingExtensionResponse(new Img[0], isSearch);
            }
            var count = query.QueryOptions.Count ?? 30;
            // user search
            var userId = Guid.Parse(turnContext.Activity.From.AadObjectId);
            var stickers = await searchService.SearchUserStickers(userId, keyword);
            if (count + skip <= stickers.Count)
            {
                var imgs = stickers.GetRange(skip, count + skip).Select(StickerToImg);
                return GetMessagingExtensionResponse(imgs, isSearch);
            }

            // tenant search
            var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
            var tenantStickers = await searchService.SearchTenantStickers(tenantId, keyword);
            stickers = stickers.Concat(tenantStickers).ToList();
            if (count + skip <= stickers.Count)
            {
                var imgs = stickers.GetRange(skip, count + skip).Select(StickerToImg);
                return GetMessagingExtensionResponse(imgs, isSearch);
            }


            if (skip > stickers.Count)
            {
                skip -= stickers.Count;
            }
            else
            {
                stickers = stickers.GetRange(skip, stickers.Count);
                skip = 0;
            }

            // official search
            var officialStickers = await searchService.SearchOfficialStickers(keyword);
            if (skip > 0)
            {
                // only officials to return
                var imgs = officialStickers.GetRange(skip, skip + count).Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                return GetMessagingExtensionResponse(imgs, isSearch);
            }
            else
            {
                var imgs = stickers.Select(StickerToImg);
                var officialImgs = officialStickers.GetRange(0, count - stickers.Count)
                .Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                return GetMessagingExtensionResponse(imgs.Concat(officialImgs), isSearch);
            }
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
