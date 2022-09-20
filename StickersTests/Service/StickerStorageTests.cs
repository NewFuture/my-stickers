using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client.Extensions.Msal;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Stickers.Entities;
using Stickers.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Stickers.Service.Tests
{
    [TestClass()]
    public class StickerStorageTests
    {
        private StickerStorage getStorage()
        {
            var inMemorySettings = new Dictionary<string, string> {
                    {"SqlConnection", "server=(localdb)\\MSSqlLocalDB;database = test;user =sa; password=Abcd1234;"},
                    {"SectionName:SomeKey", "SectionValue"},
                    //...populate as needed for the test
            };
            IConfiguration configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            DapperContext context = new DapperContext(configuration);
            StickerStorage storage = new StickerStorage(context);
            return storage;
        }

        [TestMethod()]
        public void getUserStickersTest()
        {
            var storage = this.getStorage();
            var list = storage.getUserStickers(Guid.NewGuid().ToString()).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        [TestMethod()]
        public void addUserStickers()
        {
            var storage = this.getStorage();
            var userId = Guid.NewGuid().ToString();
            Sticker sticker = new Sticker()
            {
                id = Guid.NewGuid().ToString(),
                src = "www.baidu.com",
                name = "jpg"
            };

            var list = storage.addUserStickers(userId,new List<Sticker>() { sticker }).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        [TestMethod()]
        public void deleteStickersTest()
        {
            var userId = "749DA494-768E-47D3-82B5-F2DE6846A0FF";
            var storage = this.getStorage();
            var list = storage.deleteUserSticker(userId, "B18274D2-A947-47D1-8936-504D606BA043").ConfigureAwait(false).GetAwaiter().GetResult();
        }

        [TestMethod()]
        public void updateStickerName()
        {
            var userId = "749DA494-768E-47D3-82B5-F2DE6846A0FF";
            var storage = this.getStorage();
            var list = storage.updateStickerName(userId, "B18274D2-A947-47D1-8936-504D606BA042", "new name").ConfigureAwait(false).GetAwaiter().GetResult();
        }
    }
}