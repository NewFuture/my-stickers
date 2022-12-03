namespace Stickers.Service;

using System.Net.Http.Json;
using System.Timers;
using Stickers.Entities;
using Stickers.Utils;

public class OfficialStickersService : IDisposable
{
    private readonly IHttpClientFactory httpClientFactory;

    private readonly ILogger<OfficialStickersService> logger;

    private readonly string indexUrl;
    private readonly Timer timer = new(TimeSpan.FromHours(8).TotalMilliseconds);

    /// <summary>
    /// 官方表情列表
    /// </summary>
    private List<OfficialSticker> Stickers { get; set; } = new List<OfficialSticker>();

    public OfficialStickersService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<OfficialStickersService> logger
    )
    {
        this.httpClientFactory = httpClientFactory;
        this.logger = logger;
        this.indexUrl = configuration[ConfigKeys.STICKERS_INDEX_URL];

        this.timer.Elapsed += async (o, e) => await this.Reresh();
        this.timer.AutoReset = true;
        this.timer.Start();
        _ = this.Reresh(); // auto refersh
    }

    public List<OfficialSticker> Search(string? keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return this.Stickers;
        }
        var lowerKeyword = keyword.ToLower();
        return this.Stickers.FindAll(s => s.keywords?.Any(k => k.Contains(lowerKeyword)) ?? false);
    }

    private async Task<List<OfficialSticker>> DownloadOfficailStickers()
    {
        this.logger.LogTrace("download latest stickers");
        var client = this.httpClientFactory.CreateClient("official-stickers");
        var offcialResult = await client.GetFromJsonAsync<OfficialStickerList>(this.indexUrl);
        return offcialResult?.stickers ?? new List<OfficialSticker>();
    }

    private async Task Reresh()
    {
        try
        {
            var stickers = await this.DownloadOfficailStickers();
            if (stickers.Count > 0)
            {
                this.Stickers = stickers;
            }
            else
            {
                this.logger.LogWarning("official stickers auto refresh Empty");
            }
        }
        catch (Exception e)
        {
            this.logger.LogError(e, "official stickers auto refresh fail");
        }
    }

    public void Dispose()
    {
        this.timer.Stop();
        this.timer.Dispose();
        GC.SuppressFinalize(this);
    }
}
