﻿namespace Stickers.Service
{
    using Microsoft.Extensions.Caching.Memory;
    using Stickers.Entities;
    using Stickers.Models;
    using Stickers.Utils;

    public class StickerService
    {
        private StickerDatabase database;
        private IMemoryCache cache;

        private static readonly MemoryCacheEntryOptions userCaheOptions =
            new MemoryCacheEntryOptions()
            {
                Priority = CacheItemPriority.Low,
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
            };

        private static readonly MemoryCacheEntryOptions tenantCacheOptions =
            new MemoryCacheEntryOptions()
            {
                Priority = CacheItemPriority.Normal,
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(8),
            };

        public StickerService(StickerDatabase database, IMemoryCache cache)
        {
            this.database = database;
            this.cache = cache;
        }

        public async Task<List<Sticker>> getUserStickers(Guid userId)
        {
            return await getStickerList(false, userId);
        }

        public async Task<List<Sticker>> getTenantStickers(Guid tenantId)
        {
            return await getStickerList(true, tenantId);
        }

        private async Task<List<Sticker>> getStickerList(Boolean isTenant, Guid id)
        {
            var cacheKey = GetCacheKey(isTenant, id);
            if (cache.TryGetValue<List<Sticker>>(cacheKey, out var cacheList))
            {
                return cacheList;
            }
            var list = await database.getStickerList(isTenant, id);
            cache.Set(cacheKey, list, isTenant ? tenantCacheOptions : userCaheOptions);
            return list;
        }

        public async Task<bool> deleteUserSticker(Guid userId, string stickerId)
        {
            return await this.deleteSticker(false, userId, stickerId);
        }

        public async Task<bool> deleteTanentSticker(Guid tenantId, string stickerId)
        {
            return await this.deleteSticker(true, tenantId, stickerId);
        }

        private async Task<bool> deleteSticker(Boolean isTenant, Guid filterId, string stickerId)
        {
            if (await this.database.deleteSticker(isTenant, filterId, stickerId))
            {
                var cacheKey = GetCacheKey(isTenant, filterId);
                cache.Remove(cacheKey);
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
            Boolean isTenant,
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
                cache.Remove(cacheKey);
                return true;
            }
            return false;
        }

        public async Task<List<Sticker>> addUserStickers(Guid userId, List<Sticker> stickers)
        {
            return await this.addStickers(false, userId, stickers);
        }

        public async Task<List<Sticker>> addTenantStickers(Guid tenantId, List<Sticker> stickers)
        {
            return await this.addStickers(true, tenantId, stickers);
        }

        private async Task<List<Sticker>> addStickers(
            Boolean isTenant,
            Guid filterId,
            List<Sticker> stickers
        )
        {
            var oldstickers = await this.getStickerList(isTenant, filterId);
            List<Sticker> result = new List<Sticker>();

            if (oldstickers != null && oldstickers.Count > 0)
            {
                var needUpdate = stickers.FindAll(o => oldstickers.Exists(s => s.src == o.src));
                foreach (var item in needUpdate)
                {
                    item.id = oldstickers.Find(s => s.src == item.src)!.id;
                    var stickerId = item.id.ToString();
                    var weight = DateTime.Now.Ticks;
                    await database.updateSticker(isTenant, filterId, stickerId, item.name, weight);
                    stickers.Remove(item);
                    result.Add(item);
                }
            }
            foreach (
                var item in stickers.Take(ENV.USER_STICKERS_MAX_NUM - (oldstickers?.Count ?? 0))
            )
            {
                await database.InsertSticker(isTenant, filterId, item);
                result.Add(item);
            }

            var cacheKey = GetCacheKey(isTenant, filterId);
            cache.Remove(cacheKey);
            return result;
        }

        private static string GetCacheKey(bool isTenant, Guid id)
        {
            return (isTenant ? "U:" : "T:") + id.ToString("N");
        }
    }
}
