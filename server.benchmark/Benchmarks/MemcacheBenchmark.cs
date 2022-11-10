namespace Benchmark;

using BenchmarkDotNet.Attributes;

using Microsoft.Extensions.Caching.Memory;

[MemoryDiagnoser]
public class MemoryCacheBenchmark
{
    private readonly MemoryCache memoryChache = new MemoryCache(new MemoryCacheOptions { });
    private readonly Guid valueGuid = Guid.Parse("16903c3b-4212-43cc-8885-0c41c2d7c53a");
    public List<Guid> Vaules => new List<Guid> { Guid.Empty, valueGuid };

    [ParamsSource(nameof(Vaules))]
    public Guid id { get; set; }

    public MemoryCacheBenchmark()
    {
        for (int i = 0; i < 1000; i++)
        {
            var guid = Guid.NewGuid();
            this.memoryChache.Set(guid, guid.ToString());
            if (i == 50)
            {
                this.memoryChache.Set(valueGuid, guid.ToString());
            }
        }
    }

    [Benchmark]
    public async Task<string> TryGetAsync()
    {
        var id = this.id;
        if (this.memoryChache.TryGetValue<string>(id, out var response))
        {
            return response!;
        }

        var res = await Task.FromResult(id.ToString());
        return this.memoryChache.Set(id, res);
    }

    [Benchmark]
    public async Task<string> GetOrCreateAsync()
    {
        var id = this.id;
        return (
            await this.memoryChache.GetOrCreateAsync<string>(
                id,
                async (e) =>
                {
                    return await Task.FromResult(id.ToString());
                }
            )
        )!;
    }

    [Benchmark]
    public string TryGet()
    {
        if (this.memoryChache.TryGetValue<string>(id, out var response))
        {
            return response!;
        }
        return this.memoryChache.Set(id, id.ToString());
    }

    [Benchmark(Baseline = true)]
    public string GetOrCreate()
    {
        return this.memoryChache.GetOrCreate<string>(id, (e) => id.ToString())!;
    }

    [IterationSetup]
    public void GlobalCleanup()
    {
        this.memoryChache.Remove(valueGuid);
    }
}
