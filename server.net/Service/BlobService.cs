using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using static System.Net.WebRequestMethods;

namespace Stickers.Service
{
    public class BlobService
    {
        private BlobServiceClient client = null;
        private string containerName = "container";
        public BlobService(string connectionString)
        {
            client = new BlobServiceClient(connectionString);
        }
        public async Task<SasInfo> getSasToken(string userId,string ext)
        {
            BlobSasBuilder sasBuilder = new BlobSasBuilder();
            sasBuilder.BlobContainerName = containerName;   
            sasBuilder.BlobName = ext;
            sasBuilder.ExpiresOn = DateTime.Now.AddMinutes(10);
            sasBuilder.SetPermissions(BlobAccountSasPermissions.All);
            var containerClient = client.GetBlobContainerClient(containerName);
            Uri sasUri = containerClient.GenerateSasUri(sasBuilder);
            return new SasInfo()
            {
                id = null,
                url = sasUri.ToString(),
                token = null,

            };
        }
        public async Task<string> commitBlocks(string userId, string id, string extWithDot,string contentType)
        {
            string fileName = $"{userId}/{id}{extWithDot}";
            var item = client.GetBlobContainerClient(this.containerName).GetBlockBlobClient(extWithDot).CommitBlockList(new List<string> { id });
            return $"https://${ENV.AZURE_STORAGE_CDN}/${this.containerName}/${fileName}";

        }
    }

    public class SasInfo
    {
        /**
         * Base64编码的ID
         */
    public string id { get; set; }
    // base64?: string;
    public string token { get; set; }
    public string url { get; set; }
}
}
