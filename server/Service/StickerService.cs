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

    public async Task<List<Sticker>> getUserStickers(Guid userId)
    {
        return await this.getStickerList(false, userId);
    }

    public async Task<List<Sticker>> getTenantStickers(Guid tenantId)
    {
        return await this.getStickerList(true, tenantId);
    }

    private async Task<List<Sticker>> getStickerList(bool isTenant, Guid id)
    {
        var cacheKey = GetCacheKey(isTenant, id);
        return (
            await this.cache.GetOrCreateAsync(
                cacheKey,
                (entry) =>
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

                    return this.database.getStickerList(isTenant, id);
                }
            )
        )!;
    }

    public async Task<bool> deleteUserSticker(Guid userId, string stickerId)
    {
        return await this.deleteSticker(false, userId, stickerId);
    }

    public async Task<bool> deleteTanentSticker(Guid tenantId, string stickerId)
    {
        return await this.deleteSticker(true, tenantId, stickerId);
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

    public async Task<bool> updateUserSticker(
        Guid userId,
        string stickerId,
        PatchStickerRequest sticker
    )
    {
        return await this.updateSticker(false, userId, stickerId, sticker);
    }

    public async Task<bool> updateTenantSticker(
        Guid tenantId,
        string stickerId,
        PatchStickerRequest sticker
    )
    {
        return await this.updateSticker(true, tenantId, stickerId, sticker);
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
                var cacheSitcker = cacheList!.Find(s => s.id == stickerGuid);
                if (cacheSitcker != null)
                {
                    // update cache name
                    cacheSitcker.name = sticker.name;
                    return true;
                }
            }
            this.cache.Remove(cacheKey);
            return true;
        }
        return false;
    }

    public async Task<List<Sticker>> addUserStickers(
        Guid userId,
        List<Sticker> stickers,
        bool checkExistingStickers = true
    )
    {
        return await this.addStickers(false, userId, stickers, checkExistingStickers);
    }

    public async Task<List<Sticker>> addTenantStickers(
        Guid tenantId,
        List<Sticker> stickers,
        bool checkExistingStickers = true
    )
    {
        return await this.addStickers(true, tenantId, stickers, checkExistingStickers);
    }

    private async Task<List<Sticker>> addStickers(
        bool isTenant,
        Guid filterId,
        List<Sticker> stickers,
        bool checkExistingStickers
    )
    {
        List<Sticker> result = new List<Sticker>();
        stickers.ForEach(s =>
        {
            if (s.name?.Length > MAX_NAME_LENGTH)
            {
                s.name = s.name[..MAX_NAME_LENGTH];
            }
        });
        List<Sticker>? oldstickers = null;
        if (checkExistingStickers)
        {
            oldstickers = await this.getStickerList(isTenant, filterId);
        }

        if (oldstickers != null && oldstickers.Count > 0)
        {
            var needUpdate = stickers.FindAll(o => oldstickers.Exists(s => s.src == o.src));
            foreach (var item in needUpdate)
            {
                item.id = oldstickers.Find(s => s.src == item.src)!.id;
                var stickerId = item.id.ToString();
                var weight = StickerDatabase.GetNewWeight();
                await this.database.updateSticker(isTenant, filterId, stickerId, item.name, weight);
                stickers.Remove(item);
                result.Add(item);
            }
        }
        foreach (var item in stickers.Take(ENV.USER_STICKERS_MAX_NUM - (oldstickers?.Count ?? 0)))
        {
            await this.database.InsertSticker(isTenant, filterId, item);
            result.Add(item);
        }

        var cacheKey = GetCacheKey(isTenant, filterId);
        this.cache.Remove(cacheKey);
        return result;
    }

    private static string GetCacheKey(bool isTenant, Guid id)
    {
        return (isTenant ? "U:" : "T:") + id.ToString("N");
    }
}
