// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;

namespace Stickers.Bot;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{

    protected override Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
    {
        var text = query?.Parameters?[0]?.Value as string ?? string.Empty;

        // We take every row of the results and wrap them in cards wrapped in MessagingExtensionAttachment objects.
        // The Preview is optional, if it includes a Tap, that will trigger the OnTeamsMessagingExtensionSelectItemAsync event back on this bot.

        // The list of MessagingExtensionAttachments must we wrapped in a MessagingExtensionResult wrapped in a MessagingExtensionResponse.
        return Task.FromResult(GetResultGrid());
    }

    public MessagingExtensionResponse GetResultGrid()
    {
        var imageFiles = Directory.EnumerateFiles("wwwroot", "*.*", SearchOption.AllDirectories)
        .Where(s => s.EndsWith(".jpg"));

        List<MessagingExtensionAttachment> attachments = new List<MessagingExtensionAttachment>();

        foreach (string img in imageFiles)
        {
            var image = img.Split("\\");
            var thumbnailCard = new ThumbnailCard();
            thumbnailCard.Images = new List<CardImage>() { new CardImage(_baseUrl + "/" + image[1]) };
            var attachment = new MessagingExtensionAttachment
            {
                ContentType = ThumbnailCard.ContentType,
                Content = thumbnailCard,
            };
            attachments.Add(attachment);
        }
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
}
