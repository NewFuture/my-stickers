using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Stickers.Service;

namespace StickersTests.Service
{
    [TestClass]
    internal class SesssionServiceTests
    {
        [TestMethod]
        public void CommonTest()
        {
            SesssionService session = new SesssionService(new MemoryCache(new MemoryCacheOptions

            {

                SizeLimit = 1024

            }));

            var id = Guid.NewGuid();
            var s = session.GenerateSession(id);
            Assert.Equals(id, session.GetSessionInfo(s));
        }
    }
}
