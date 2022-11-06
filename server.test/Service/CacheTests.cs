namespace Stickers.Service.Tests;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass()]
public class CacheTests
{
    private int cout = 0;

    [TestMethod()]
    public async Task TestGetOrCreateAsyncOnce()
    {
        var cache = new MemoryCache(new MemoryCacheOptions());
        var key = "testKey";
        var task1 = cache.GetOrCreateAsync(key, async (c) => await this.GetIntAsync());
        await Task.Delay(100);
        Assert.AreEqual(1, this.cout);
        var rest = await cache.GetOrCreateAsync(key, async (c) => await this.GetIntAsync());
        Assert.AreEqual(1, rest);
        // Assert.AreEqual(1, this.cout);

        var res1 = await task1;
        Assert.AreEqual(1, res1);
        // Assert.AreEqual(1, this.cout);

        var res3 = await cache.GetOrCreateAsync(key, async (c) => await this.GetIntAsync());
        Assert.AreEqual(1, res3);
        // Assert.AreEqual(1, this.cout);

        var res4 = cache.Get(key);
        Assert.AreEqual(1, res4);
        cache.Remove(key);
    }

    private async Task<int> GetIntAsync()
    {
        this.cout += 1;
        await Task.Delay(800);
        return 1;
    }
}
