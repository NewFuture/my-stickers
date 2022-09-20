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
        private string connectionString = "DefaultEndpointsProtocol=https;AccountName=stickerstestblob;AccountKey=iHF/+qta9aawXNS+2/d1+kiWusozauf059iEB6UhIeg+vD5LIRktA/KebxFZWDAVNvNeeJnAp88w+AStvquR3g==;EndpointSuffix=core.windows.net";
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