// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder.Teams;
using Stickers.Service;
using Stickers.Utils;
using AdaptiveCards.Templating;
using Newtonsoft.Json.Linq;

namespace Stickers.Bot
{
    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {
        public readonly string WebUrl;
        private StickerService stickerService;
        private SearchService searchService;
        private ILogger<TeamsMessagingExtensionsBot> logger;
        private SessionService session;

        private static readonly Dictionary<string, AdaptiveCardTemplate> cardDict = new Dictionary<string, AdaptiveCardTemplate>();


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

                string cardPath = ResourceFilePathHelper.GetFilePath(Path.Combine("Cards", cardFileName));
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
}
