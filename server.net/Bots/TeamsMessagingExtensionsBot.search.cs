// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Stickers.Models;
using Stickers.Resources;
using System.Text.RegularExpressions;

namespace Stickers.Bot
{

    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {

        protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
        {
            var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

            // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
            // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            return await GetResultGrid(turnContext, query);
        }

        public async Task<MessagingExtensionResponse> GetResultGrid(ITurnContext turnContext, MessagingExtensionQuery query)
        {

            var userId = turnContext.Activity?.From?.AadObjectId;
            var imageEntities = await this.stickerStorage.getUserStickers(Guid.Parse(userId));
            var search = this.GetQueryParameters(query, "searchQuery");
            var skip = query.QueryOptions.Skip ?? 0;
            var count = query.QueryOptions.Count ?? imageEntities.Count;
            IEnumerable<Img> imageFiles = null;

            if (search != null)
            {
                List<Img> temp = null;
                Regex regex = new Regex(search.Trim().Replace("\\s+", ".*"));
                imageEntities = imageEntities.Where(i => !string.IsNullOrEmpty(i.name) && regex.IsMatch(i.name)).ToList();
                var officialImgs = this.officialStickersSearchHandler.Search(search).Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                temp = imageEntities.Select(entity => new Img { Src = entity.src, Alt = entity.name }).ToList();
                temp.AddRange(officialImgs);
                imageFiles = temp.GetRange(skip, count + skip < imageEntities.Count ? count : imageEntities.Count - skip);
            }
            else
            {
                List<Img> temp = null;
                var officialImgs = this.officialStickersSearchHandler.GetAllOfficialStickers().Select(os => new Img { Alt = os.name, Src = this.WebUrl + os.url });
                temp = imageEntities.Select(entity => new Img { Src = entity.src, Alt = entity.name }).ToList();
                temp.AddRange(officialImgs);
                imageFiles = temp.GetRange(skip, count + skip < imageEntities.Count ? count : imageEntities.Count - skip);
            }


            List<MessagingExtensionAttachment> attachments = new List<MessagingExtensionAttachment>();

            foreach (var img in imageFiles)
            {
                var thumbnailCard = new ThumbnailCard();
                thumbnailCard.Images = new List<CardImage>() { new CardImage(img.Src) };
                var cardJson = this.GetAdaptiveCardJsonObject(img, "StickerCard.json");
                var attachment = new MessagingExtensionAttachment
                {
                    ContentType = "application/vnd.microsoft.card.adaptive",
                    Content = cardJson,
                    Preview = thumbnailCard.ToAttachment(),
                };
                attachments.Add(attachment);
            }
            return new MessagingExtensionResponse
            {
                ComposeExtension = attachments.Count > 0 ? new MessagingExtensionResult
                {
                    Type = "result",
                    AttachmentLayout = "grid",
                    Attachments = attachments
                } : new MessagingExtensionResult
                {
                    Type = "config",
                    Text = LocalizationHelper.LookupString("initial_run_upload_stickers", GetCultureInfoFromBotActivity(turnContext.Activity)),
                    SuggestedActions = new MessagingExtensionSuggestedAction
                    {
                        Actions = new List<CardAction>
                        {
                            new CardAction
                            {
                                Type = "openUrl",
                                Title = "Settings",
                                Value = this.GetConfigUrl()
                            }
                        }
                    }
                }
            };
        }

        private string GetQueryParameters(MessagingExtensionQuery query, string name)
        {
            return query.Parameters?.SingleOrDefault(q => q.Name.Equals(name))?.Value.ToString();
        }

        private string GetConfigUrl()
        {
            return $"{this.WebUrl}/config/";
        }
    }
}
