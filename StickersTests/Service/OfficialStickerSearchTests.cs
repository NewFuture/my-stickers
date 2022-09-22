using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Stickers.Search;
using Stickers.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Stickers.Service.Tests
{
    [TestClass]
    public class OfficialStickerSearchTests
    {
        [TestMethod]
        public void CommonTest()
        {
            OfficialStickersSearchHandler searchHandler = new OfficialStickersSearchHandler();

            searchHandler.Search("love");
            searchHandler.Search("noth");
        }
    }
}