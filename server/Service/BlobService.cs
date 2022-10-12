using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Stickers.Utils;

namespace Stickers.Service
{
    public class BlobService
    {
        private BlobServiceClient client;
        private string containerName = "stickers";
        private string cdn;

        private string[] supportExtList = new string[] { "png", "gif", "jpg", "jpeg" };

        public BlobService(BlobServiceClient client, IConfiguration configuration)
        {
            this.client = client;
            this.cdn = configuration[ConfigKeys.CDN_DOMAIN];
        }

        public SasInfo getSasToken(Guid userId, string ext)
        {
            var id = Guid.NewGuid().ToString("N").ToLower();
            ext = ext.ToLower();
            string fileName = $"{userId.ToString("N")}/{id}";
            if (supportExtList.Contains(ext))
            {
                // add ext
                fileName += $".{ext}";
            }

            BlobSasBuilder sasBuilder = new BlobSasBuilder();
            sasBuilder.BlobContainerName = containerName;
            sasBuilder.BlobName = fileName;
            sasBuilder.ExpiresOn = DateTime.Now.AddMinutes(10);
            sasBuilder.SetPermissions(BlobAccountSasPermissions.All);
            var containerClient = client.GetBlobContainerClient(containerName);
            var blockClient = containerClient.GetBlockBlobClient(fileName);
            Uri sasUri = blockClient.GenerateSasUri(sasBuilder);
            //Uri sasUri = containerClient.GenerateSasUri(sasBuilder);
            return new SasInfo()
            {
                id = id,
                url = sasUri.ToString(),
                token = String.Empty,
            };
        }

        public async Task<string> commitBlocks(
            Guid userId,
            string id,
            string extWithDot,
            string contentType
        )
        {
            if (!supportExtList.Contains(extWithDot.TrimStart('.')))
            {
                // remove ext
                extWithDot = "";
            }
            string fileName = $"{userId.ToString("N")}/{id}{extWithDot}";
            var encodeId = Convert.ToBase64String(
                System.Text.Encoding.GetEncoding(28591).GetBytes(id)
            );
            var blockclient = client
                .GetBlobContainerClient(this.containerName)
                .GetBlockBlobClient(fileName);
            var item = await blockclient.CommitBlockListAsync(new List<string> { encodeId });
            return $"https://{this.cdn}/{this.containerName}/{fileName}";
        }
    }

    public class SasInfo
    {
        /**
         * Base64编码的ID
         */
        public string? id { get; set; }

        // base64?: string;
        public string? token { get; set; }
        public string? url { get; set; }
    }
}
