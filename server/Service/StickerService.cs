namespace Stickers.Service;

using Microsoft.Extensions.Caching.Memory;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Utils;

public class StickerService
{
    public const int MAX_NAME_LENGTH = 64;
    private readonly StickerDatabase database;
    private readonly IMemoryCache cache;

    private static readonly TimeSpan userCacheTime = TimeSpan.FromHours(8);
    private static readonly TimeSpan tenantCacheTime = TimeSpan.FromHours(12);

    public StickerService(StickerDatabase database, IMemoryCache cache)
    {
        this.database = database;
        this.cache = cache;
    }

    public Task<List<Sticker>> getUserStickers(Guid userId)
    {
        return this.getStickerList(false, userId);
    }

    public Task<List<Sticker>> getTenantStickers(Guid tenantId)
    {
        return this.getStickerList(true, tenantId);
    }

    private async Task<List<Sticker>> getStickerList(bool isTenant, Guid id)
    {
        var cacheKey = GetCacheKey(isTenant, id);
        return (
            await this.cache.GetOrCreateAsync(
                cacheKey,
                async (entry) =>
                {
                    if (isTenant)
                    {
                        entry.AbsoluteExpirationRelativeToNow = tenantCacheTime;
                    }
                    else
                    {
                        entry.AbsoluteExpirationRelativeToNow = userCacheTime;
                        entry.Priority = CacheItemPriority.Low;
                    }

                    return await this.database.getStickerList(isTenant, id);
                }
            )
        )!;
    }

    public Task<bool> deleteUserSticker(Guid userId, string stickerId)
    {
        return this.deleteSticker(false, userId, stickerId);
    }

    public Task<bool> deleteTanentSticker(Guid tenantId, string stickerId)
    {
        return this.deleteSticker(true, tenantId, stickerId);
    }

    private async Task<bool> deleteSticker(bool isTenant, Guid filterId, string stickerId)
    {
        if (await this.database.deleteSticker(isTenant, filterId, stickerId))
        {
            var cacheKey = GetCacheKey(isTenant, filterId);
            this.cache.Remove(cacheKey);
            return true;
        }
        return false;
    }

    public Task<bool> updateUserSticker(Guid userId, string stickerId, PatchStickerRequest sticker)
    {
        return this.updateSticker(false, userId, stickerId, sticker);
    }

    public Task<bool> updateTenantSticker(
        Guid tenantId,
        string stickerId,
        PatchStickerRequest sticker
    )
    {
        return this.updateSticker(true, tenantId, stickerId, sticker);
    }

    private async Task<bool> updateSticker(
        bool isTenant,
        Guid filterId,
        string stickerId,
        PatchStickerRequest sticker
    )
    {
        if (
            await this.database.updateSticker(
                isTenant,
                filterId,
                stickerId,
                sticker.name,
                sticker.weight
            )
        )
        {
            var cacheKey = GetCacheKey(isTenant, filterId);
            if (
                !sticker.weight.HasValue
                && this.cache.TryGetValue<List<Sticker>>(cacheKey, out var cacheList)
            )
            {
                // update cacheList directly, when weight not changed
                var stickerGuid = Guid.Parse(stickerId);
                var cacheSticker = cacheList!.Find(s => s.id == stickerGuid);
                if (cacheSticker != null)
                {
                    // update cache name
                    cacheSticker.name = sticker.name;
                    return true;
                }
            }
            this.cache.Remove(cacheKey);
            return true;
        }
        return false;
    }

    public Task<List<Sticker>> addUserStickers(
        Guid userId,
        List<Sticker> stickers,
        bool checkExistingStickers = true
    )
    {
        return this.addStickers(false, userId, stickers, checkExistingStickers);
    }

    public Task<List<Sticker>> addTenantStickers(
        Guid tenantId,
        List<Sticker> stickers,
        bool checkExistingStickers = true
    )
    {
        return this.addStickers(true, tenantId, stickers, checkExistingStickers);
    }

    private async Task<List<Sticker>> addStickers(
        bool isTenant,
        Guid filterId,
        List<Sticker> stickers,
        bool checkExistingStickers
    )
    {
        List<Sticker> result = new List<Sticker>();
        foreach (var s in stickers)
        {
            if (s.name?.Length > MAX_NAME_LENGTH)
            {
                s.name = s.name[..MAX_NAME_LENGTH];
            }
        }
        List<Sticker>? oldstickers = null;
        if (checkExistingStickers)
        {
            oldstickers = await this.getStickerList(isTenant, filterId);
        }

        if (oldstickers?.Count > 0)
        {
            oldstickers.ForEach(async sticker =>
            {
                var item = stickers.Find(s => s?.src == sticker.src);
                if (item != null)
                {
                    stickers.Remove(item);
                    item.id = sticker.id;
                    if (item.weight <= 0)
                    {
                        item.weight = StickerDatabase.GetNewWeight();
                    }
                    await this.database.updateSticker(
                        isTenant,
                        filterId,
                        item.id.ToString(),
                        item.name,
                        item.weight
                    );
                    result.Add(item);
                }
            });
        }
        var newItems = stickers.Take(ENV.USER_STICKERS_MAX_NUM - (oldstickers?.Count ?? 0));
        var count = newItems.Count();
        if (count == 1)
        {
            await this.database.InsertSticker(isTenant, filterId, newItems.First());
        }
        else if (count > 1)
        {
            await this.database.InsertStickers(isTenant, filterId, newItems);
        }
        var cacheKey = GetCacheKey(isTenant, filterId);
        this.cache.Remove(cacheKey);
        result.AddRange(newItems);
        return result;
    }

    private static string GetCacheKey(bool isTenant, Guid id)
    {
        return (isTenant ? "U:" : "T:") + id.ToString("N");
    }
}
