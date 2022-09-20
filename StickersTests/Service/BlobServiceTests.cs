using Microsoft.VisualStudio.TestTools.UnitTesting;
using Stickers.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Stickers.Service.Tests
{
    [TestClass()]
    public class BlobServiceTests
    {
        private string connectionString = "";
        [TestMethod()]
        public void getSasTokenTest()
        {
            BlobService blob = new BlobService(connectionString);
            var uri =blob.getSasToken("testuser", "jpg").ConfigureAwait(false).GetAwaiter().GetResult();
        }
        [TestMethod()]
        public void commitTest()
        {
            BlobService blob = new BlobService(connectionString);
            var uri = blob.commitBlocks("testuser","","jpg","image/jpg").ConfigureAwait(false).GetAwaiter().GetResult();
        }
    }
}