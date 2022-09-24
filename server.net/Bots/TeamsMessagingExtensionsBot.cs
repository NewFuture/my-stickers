// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Stickers.Search;
using Stickers.Service;
using Stickers.Utils;


namespace Stickers.Bot
{
    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {
        public readonly string WebUrl;
        private StickerStorage stickerStorage;
        private OfficialStickersSearchHandler officialStickersSearchHandler;
        private ILogger<TeamsMessagingExtensionsBot> logger;
        private SessionService session;


        public TeamsMessagingExtensionsBot(
            IConfiguration configuration,
            StickerStorage stickerStorage,
            OfficialStickersSearchHandler officialStickersSearchHandler,
            ILogger<TeamsMessagingExtensionsBot> logger,
            SessionService sessionService) : base()
        {
            this.WebUrl = configuration[ConfigKeys.WEB_URL];
            this.stickerStorage = stickerStorage;
            this.officialStickersSearchHandler = officialStickersSearchHandler;
            this.logger = logger;
            this.session = sessionService;
        }

        /// <summary>
        /// Get Config URL with sessio Key
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        private string GetConfigUrl(Guid userId)
        {
            return $"{this.WebUrl}/config/#{this.session.GenerateSession(userId)}";
        }
    }
}
