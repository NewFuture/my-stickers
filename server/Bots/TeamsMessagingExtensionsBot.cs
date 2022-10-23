// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs


namespace Stickers.Bot;
using AdaptiveCards.Templating;
using Microsoft.Bot.Builder.Teams;
using Newtonsoft.Json.Linq;
using Stickers.Service;
using Stickers.Utils;

public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
{
    public readonly string WebUrl;
    private readonly StickerService stickerService;
    private readonly SearchService searchService;
    private readonly ILogger<TeamsMessagingExtensionsBot> logger;
    private readonly SessionService session;

    private static readonly Dictionary<string, AdaptiveCardTemplate> cardDict = new();

    public TeamsMessagingExtensionsBot(
        IConfiguration configuration,
        StickerService stickerStorage,
        SearchService searchService,
        SessionService sessionService,
        ILogger<TeamsMessagingExtensionsBot> logger
    ) : base()
    {
        this.WebUrl = configuration[ConfigKeys.WEB_URL];
        this.stickerService = stickerStorage;
        this.searchService = searchService;
        this.logger = logger;
        this.session = sessionService;
    }

    private static JObject GetAdaptiveCardJsonObject(object cardPayload, string cardFileName)
    {
        if (!cardDict.TryGetValue(cardFileName, out var template))
        {
            string cardPath = ResourceFilePathHelper.GetFilePath(
                Path.Combine("Cards", cardFileName)
            );
            var cardJsonString = File.ReadAllText(cardPath);

            template = new AdaptiveCardTemplate(cardJsonString);
            cardDict.Add(cardFileName, template);
        }
        var cardJson = template.Expand(cardPayload);
        return JObject.Parse(cardJson);
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
