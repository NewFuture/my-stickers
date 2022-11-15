// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

namespace Stickers.Bot;

using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Stickers.Service;
using Stickers.Utils;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{
    public readonly string WebUrl;
    private readonly StickerService stickerService;
    private readonly SearchService searchService;
    private readonly ILogger<TeamsMessagingExtensionsBot> logger;
    private readonly IBotTelemetryClient telemetryClient;
    private readonly SessionService session;

    public TeamsMessagingExtensionsBot(
        IConfiguration configuration,
        StickerService stickerStorage,
        SearchService searchService,
        SessionService sessionService,
        ILogger<TeamsMessagingExtensionsBot> logger,
        IBotTelemetryClient telemetryClient
    ) : base()
    {
        this.WebUrl = configuration[ConfigKeys.WEB_URL];
        this.stickerService = stickerStorage;
        this.searchService = searchService;
        this.logger = logger;
        this.session = sessionService;
        this.telemetryClient = telemetryClient;
    }

    /// <summary>
    /// Get Config URL with sessio Key
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    private string GetConfigUrl(Guid userId)
    {
        const string queryString = "lng={locale}&theme={theme}";
        return $"{this.WebUrl}/config/?{queryString}#{this.session.GenerateSession(userId)}";
    }
}
