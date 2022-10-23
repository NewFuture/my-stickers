namespace Stickers.Service;
using Microsoft.Extensions.Caching.Memory;

public class SessionService
{
    private readonly IMemoryCache _cache;
    public readonly static TimeSpan TTL = TimeSpan.FromMinutes(30);

    private static readonly MemoryCacheEntryOptions options = new MemoryCacheEntryOptions()
    {
        Priority = CacheItemPriority.High,
        AbsoluteExpirationRelativeToNow = TTL,
    };

    public SessionService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public Guid GetSessionInfo(Guid key)
    {
        return this._cache.Get<Guid>(key);
    }

    public Guid GenerateSession(Guid userId)
    {
        var key = Guid.NewGuid();
        this._cache.Set(key, userId, options);
        return key;
    }
}
