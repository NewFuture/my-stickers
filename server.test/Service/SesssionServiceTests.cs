using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Stickers.Service.Tests
{
    [TestClass()]
    public class SesssionServiceTests
    {
        [TestMethod()]
        public void SeesionTest()
        {
            var session = new SessionService(new MemoryCache(new MemoryCacheOptions { }));

            var id = Guid.NewGuid();
            var s = session.GenerateSession(id);
            Assert.IsTrue(session.TryGetSessionInfo(s, out var uid));
            Assert.AreEqual(id, uid);
        }
    }
}
