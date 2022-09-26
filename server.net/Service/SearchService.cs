namespace Stickers.Service
{
    using Stickers.Entities;
    using Stickers.Search;

    public class SearchService
    {
        private OfficialStickersSearchHandler officialStickersSearch;
        private StickerService stickerService;
        public SearchService(OfficialStickersSearchHandler officialStickersSearchHandler, StickerService stickerService)
        {
            this.stickerService = stickerService;
            this.officialStickersSearch = officialStickersSearchHandler;

        }


        public async Task<List<Sticker>> SearchUserStickers(Guid userId, string? keyword)
        {
            var userStickers = await stickerService.getUserStickers(userId);
            if (String.IsNullOrWhiteSpace(keyword))
            {
                return userStickers;
            }
            //  Regex regex = new Regex(search.Trim().Replace("\\s+", ".*"));
            // imageEntities = imageEntities.Where(i => !string.IsNullOrEmpty(i.name) && regex.IsMatch(i.name)).ToList();
            return userStickers.FindAll(s => s.name.Contains(keyword));
        }

        public async Task<List<Sticker>> SearchTenantStickers(Guid tenantId, string? keyword)
        {

            var stickers = await stickerService.getTenantStickers(tenantId);
            if (String.IsNullOrWhiteSpace(keyword))
            {
                return stickers;
            }
            //  Regex regex = new Regex(search.Trim().Replace("\\s+", ".*"));
            // imageEntities = imageEntities.Where(i => !string.IsNullOrEmpty(i.name) && regex.IsMatch(i.name)).ToList();
            return stickers.FindAll(s => s.name.Contains(keyword));
        }

        public async Task<List<Models.OfficialSticker>> SearchOfficialStickers(string? keyword, int top = 30)
        {
            return await this.officialStickersSearch.Search(keyword);
        }

    }
}
