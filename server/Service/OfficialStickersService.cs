namespace Stickers.Service;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stickers.Entities;
using Stickers.Utils;

public class OfficialStickersService
{
    private IHttpClientFactory httpClientFactory;
    private readonly IMemoryCache cache;

    private string indexUrl;

    private const string CACHE_KEY = "official-stickers";

    private static readonly MemoryCacheEntryOptions options = new MemoryCacheEntryOptions()
    {
        Priority = CacheItemPriority.High,
        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12),
    };

    public OfficialStickersService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IMemoryCache cache
    )
    {
        this.httpClientFactory = httpClientFactory;
        this.cache = cache;
        this.indexUrl = configuration[ConfigKeys.STICKERS_INDEX_URL];
    }

    public async Task<List<OfficialSticker>> GetOfficialStickers()
    {
        if (cache.TryGetValue<List<OfficialSticker>>(CACHE_KEY, out var list))
        {
            return list;
        }
        var client = httpClientFactory.CreateClient("official-stickers");
        var response = await client.GetAsync(this.indexUrl);
        response.EnsureSuccessStatusCode();
        string responseBody = response.Content.ReadAsStringAsync().Result;
        var jObject = JsonConvert.DeserializeObject(responseBody) as JObject;
        var stickers = jObject["stickers"].ToObject<List<OfficialSticker>>();
        if (stickers == null)
        {
            return new List<OfficialSticker>();
        }
        cache.Set(CACHE_KEY, stickers);
        return stickers;
    }

    public async Task<List<OfficialSticker>> Search(
        string keyword,
        CancellationToken? cancellationToken = null
    )
    {
        var list = await this.GetOfficialStickers();
        cancellationToken?.ThrowIfCancellationRequested();
        if (String.IsNullOrWhiteSpace(keyword))
        {
            return list;
        }

        var lowerKeyword = keyword.ToLower();
        return list.FindAll(s => s.keywords.Any(k => k.Contains(lowerKeyword)));
    }
}
