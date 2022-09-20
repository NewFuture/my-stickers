// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/51.teams-messaging-extensions-action/Bots/TeamsMessagingExtensionsActionBot.cs

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;

namespace Stickers.Bot;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{

    protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionSubmitActionAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
    {
        return await Task.FromResult(new MessagingExtensionActionResponse());
    }
}