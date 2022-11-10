using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Stickers.Service.Tests
{
    [TestClass()]
    public class BlobServiceTests
    {
        private readonly string connectionString = "";

        private BlobService GetBlobService()
        {
            var logger = LoggerFactory.Create((c) =>
            {
                c.AddConsole();
            }).CreateLogger<BlobService>();
            BlobService blob = new BlobService(
                new Azure.Storage.Blobs.BlobServiceClient(this.connectionString),
                getConfig(),
                logger
            );
            return blob;
        }

        [TestMethod()]
        public void getSasTokenTest()
        {
            var blob = this.GetBlobService();
            blob.getSasToken(Guid.NewGuid(), "jpg");
        }

        [TestMethod()]
        public void commitTest()
        {
            var blob = this.GetBlobService();
            _ = blob.commitBlocks(Guid.NewGuid(), Guid.NewGuid(), "jpg", "image/jpg")
                .ConfigureAwait(false)
                .GetAwaiter()
                .GetResult();
        }

        private static IConfiguration getConfig()
        {
            var configurationBuilder = new ConfigurationBuilder().AddInMemoryCollection(
                new Dictionary<string, string> { ["BlobConnection"] = "Blob Connection" }
            );

            return configurationBuilder.Build();
        }
    }
}
