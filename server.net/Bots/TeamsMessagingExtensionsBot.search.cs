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
            // var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

            // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
            // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            return await GetResultGrid(turnContext, query);
        }

        private async Task<MessagingExtensionResponse> GetResultGrid(ITurnContext turnContext, MessagingExtensionQuery query)
        {

            var keyword = this.GetQueryParameters(query, "query");
            var skip = query.QueryOptions.Skip ?? 0;

            if (!String.IsNullOrEmpty(keyword) && skip > 0)
            {
                // search 最多支持一页
                return this.GetMessagingExtensionResponse(new Img[0]);
            }
            var count = query.QueryOptions.Count ?? 0;


            // user search
            var userId = Guid.Parse(turnContext.Activity?.From?.AadObjectId);
            var stickers = await searchService.SearchUserStickers(userId, keyword);
            if (count + skip <= stickers.Count)
            {
                var imgs = stickers.GetRange(skip, count + skip).Select(StickerToImg);
                return GetMessagingExtensionResponse(imgs);
            }

            // tenant search
            var tenantId = Guid.Parse(turnContext.Activity.Conversation.TenantId);
            var tenantStickers = await searchService.SearchTenantStickers(tenantId, keyword);
            stickers.AddRange(tenantStickers);
            if (count + skip <= stickers.Count)
            {
                var imgs = stickers.GetRange(skip, count + skip).Select(StickerToImg);
                return GetMessagingExtensionResponse(imgs);
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
                return GetMessagingExtensionResponse(imgs);
            }
            else
            {
                var imgs = stickers.Select(StickerToImg);
                var officialImgs = officialStickers.GetRange(0, count - stickers.Count)
                .Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                return GetMessagingExtensionResponse(imgs.Concat(officialImgs));
            }


        }

        private MessagingExtensionResponse GetMessagingExtensionResponse(IEnumerable<Img> images)
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
                ComposeExtension = new MessagingExtensionResult
                {
                    Type = "result",
                    AttachmentLayout = "grid",
                    Attachments = attachments
                }
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
