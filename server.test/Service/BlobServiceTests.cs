using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Stickers.Service.Tests
{
    [TestClass()]
    public class BlobServiceTests
    {
        private readonly string connectionString = "";

        [TestMethod()]
        public void getSasTokenTest()
        {
            BlobService blob = new BlobService(
                new Azure.Storage.Blobs.BlobServiceClient(this.connectionString),
                getConfig()
            );
            var uri = blob.getSasToken(Guid.NewGuid(), "jpg");
        }

        [TestMethod()]
        public void commitTest()
        {
            BlobService blob = new BlobService(
                new Azure.Storage.Blobs.BlobServiceClient(this.connectionString),
                getConfig()
            );
            var uri = blob.commitBlocks(Guid.NewGuid(), Guid.NewGuid(), "jpg", "image/jpg")
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
