// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// @see https://github.com/microsoft/BotBuilder-Samples/blob/main/samples/csharp_dotnetcore/50.teams-messaging-extensions-search/Bots/TeamsMessagingExtensionsSearchBot.cs

using Microsoft.Bot.Builder.Teams;
using Stickers.Search;
using Stickers.Service;

namespace Stickers.Bot
{
    public partial class TeamsMessagingExtensionsBot : TeamsActivityHandler
    {
        public readonly string WebUrl;
        private StickerStorage stickerStorage = null;
        private OfficialStickersSearchHandler officialStickersSearchHandler = null;

        public TeamsMessagingExtensionsBot(IConfiguration configuration, StickerStorage stickerStorage, OfficialStickersSearchHandler officialStickersSearchHandler) : base()
        {
            this.WebUrl = configuration["WebUrl"];
            this.stickerStorage = stickerStorage;
            this.officialStickersSearchHandler = officialStickersSearchHandler;
        }
    }
}
