namespace Stickers.Service;

using System.Timers;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stickers.Entities;
using Stickers.Utils;

public class OfficialStickersService : IDisposable
{
    private readonly IHttpClientFactory httpClientFactory;
    private readonly IMemoryCache cache;
    private readonly ILogger<OfficialStickersService> logger;

    private readonly string indexUrl;

    private const string CACHE_KEY = "official-stickers";

    private static readonly MemoryCacheEntryOptions cacheOptions =
        new()
        {
            Priority = CacheItemPriority.High,
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12),
        };

    private readonly Timer timer = new(TimeSpan.FromHours(10).TotalMilliseconds);

    public OfficialStickersService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IMemoryCache cache,
        ILogger<OfficialStickersService> logger
    )
    {
        this.httpClientFactory = httpClientFactory;
        this.cache = cache;
        this.logger = logger;
        this.indexUrl = configuration[ConfigKeys.STICKERS_INDEX_URL];

        this.timer.Elapsed += async (o, e) => await this.Reresh();
        this.timer.AutoReset = true;
        this.timer.Start();
        _ = this.Reresh(); // auto refersh
    }

    public async Task<List<OfficialSticker>> GetOfficialStickers()
    {
        return await this.cache.GetOrCreateAsync(CACHE_KEY, this.CacheFactory);
    }

    public async Task<List<OfficialSticker>> Search(
        string keyword,
        CancellationToken? cancellationToken = null
    )
    {
        var list = await this.GetOfficialStickers();
        cancellationToken?.ThrowIfCancellationRequested();
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return list;
        }

        var lowerKeyword = keyword.ToLower();
        return list.FindAll(s => s.keywords?.Any(k => k.Contains(lowerKeyword)) ?? false);
    }

    private async Task<List<OfficialSticker>> DownloadOfficailStickers()
    {
        this.logger.LogTrace("download latest stickers");
        var client = this.httpClientFactory.CreateClient("official-stickers");
        var response = await client.GetAsync(this.indexUrl);
        response.EnsureSuccessStatusCode();
        string responseBody = response.Content.ReadAsStringAsync().Result;
        var jObject = JsonConvert.DeserializeObject<JObject>(responseBody);
        var stickers = jObject?["stickers"]?.ToObject<List<OfficialSticker>>();
        return stickers ?? new List<OfficialSticker>();
    }

    private async Task<List<OfficialSticker>> CacheFactory(ICacheEntry cacheEntry)
    {
        var stickers = await this.DownloadOfficailStickers();
        cacheEntry.Priority = cacheOptions.Priority;
        if (stickers.Count == 0)
        {
            cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
        }
        else
        {
            cacheEntry.AbsoluteExpirationRelativeToNow =
                cacheOptions.AbsoluteExpirationRelativeToNow;
        }
        return stickers;
    }

    private async Task Reresh()
    {
        try
        {
            var stickers = await this.DownloadOfficailStickers();
            if (stickers.Count > 0)
            {
                this.cache.Set(CACHE_KEY, stickers, cacheOptions);
            }
            else
            {
                this.logger.LogWarning("official stickers auto refresh Empty");
            }
        }
        catch (Exception e)
        {
            this.logger.LogError("official stickers auto refresh fail: {exception}", e);
        }

    }

    public void Dispose()
    {
        this.timer.Stop();
        this.timer.Dispose();
        GC.SuppressFinalize(this);
    }
}
