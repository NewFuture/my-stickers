namespace Stickers.Service;

using Stickers.Entities;

public class SearchService
{
    private readonly OfficialStickersService officialStickersService;
    private readonly StickerService stickerService;

    public SearchService(
        OfficialStickersService officialStickersSearchHandler,
        StickerService stickerService
    )
    {
        this.stickerService = stickerService;
        this.officialStickersService = officialStickersSearchHandler;
    }

    public async Task<List<Sticker>> SearchUserStickers(
        Guid userId,
        string? keyword,
        CancellationToken cancellationToken
    )
    {
        var userStickers = await this.stickerService.getUserStickers(userId);
        cancellationToken.ThrowIfCancellationRequested();
        if (String.IsNullOrWhiteSpace(keyword))
        {
            return userStickers;
        }
        //  Regex regex = new Regex(search.Trim().Replace("\\s+", ".*"));
        // imageEntities = imageEntities.Where(i => !string.IsNullOrEmpty(i.name) && regex.IsMatch(i.name)).ToList();
        return userStickers.FindAll(s => s.name?.ToLower().Contains(keyword) ?? false);
    }

    public async Task<List<Sticker>> SearchTenantStickers(
        Guid tenantId,
        string? keyword,
        CancellationToken cancellationToken
    )
    {
        var stickers = await this.stickerService.getTenantStickers(tenantId);
        cancellationToken.ThrowIfCancellationRequested();
        if (String.IsNullOrWhiteSpace(keyword))
        {
            return stickers;
        }
        //  Regex regex = new Regex(search.Trim().Replace("\\s+", ".*"));
        // imageEntities = imageEntities.Where(i => !string.IsNullOrEmpty(i.name) && regex.IsMatch(i.name)).ToList();
        return stickers.FindAll(s => s.name?.ToLower().Contains(keyword) ?? false);
    }

    public List<OfficialSticker> SearchOfficialStickers(string? keyword)
    {
        return this.officialStickersService.Search(keyword);
    }
}
