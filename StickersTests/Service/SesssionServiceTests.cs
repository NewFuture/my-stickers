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
            SesssionService session = new SesssionService(new MemoryCache(new MemoryCacheOptions { }));

            var id = Guid.NewGuid();
            var s = session.GenerateSession(id);
            Assert.AreEqual(id, session.GetSessionInfo(s));
        }
    }
}
