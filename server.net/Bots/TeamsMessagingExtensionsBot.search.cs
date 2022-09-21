// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Stickers.Models;
using Stickers.Resources;

namespace Stickers.Bot
{

    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {

        protected override Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
        {
            var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

            // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
            // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

            // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
            return Task.FromResult(GetResultGrid(turnContext));
        }

        public MessagingExtensionResponse GetResultGrid(ITurnContext turnContext)
        {
            var imageFiles = new List<Img> { new Img { Src = "https://us-api.asm.skype.com/v1/objects/0-wus-d8-42bf9c065270a85665ee1c1bd8f2814f/views/imgo", Alt = "Test" } };

            List<MessagingExtensionAttachment> attachments = new List<MessagingExtensionAttachment>();

            foreach (var img in imageFiles)
            {
                var thumbnailCard = new ThumbnailCard();
                thumbnailCard.Images = new List<CardImage>() { new CardImage(img.Src) };
                var attachment = new MessagingExtensionAttachment
                {
                    ContentType = ThumbnailCard.ContentType,
                    Content = thumbnailCard,
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

        private string GetConfigUrl()
        {
            return $"{this.WebUrl}/congfig";
        }
    }
}
