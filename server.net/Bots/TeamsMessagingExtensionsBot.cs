// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder.Teams;

namespace Stickers.Bot;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{
    public readonly string _baseUrl;
    public TeamsMessagingExtensionsBot(IConfiguration configuration) : base()
    {
        this._baseUrl = configuration["BaseUrl"];
    }
}
