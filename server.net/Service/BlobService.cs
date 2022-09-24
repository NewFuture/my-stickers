﻿using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;

namespace Stickers.Service
{
    public class BlobService
    {
        private BlobServiceClient client;
        private string containerName = "container";

        private string[] supportExtList = new string[] { "png", "gif", "jpg", "jpeg" };
        public BlobService(IConfiguration configuration)
        {
            var blobConnection = configuration["BlobConnection"];
            client = new BlobServiceClient(blobConnection);
        }

        public SasInfo getSasToken(Guid userId, string ext)
        {
            var id = Guid.NewGuid().ToString().ToLower();
            ext = ext.ToLower();
            string fileName = $"{userId}/{id}";
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
        public async Task<string> commitBlocks(Guid userId, string id, string extWithDot, string contentType)
        {
            string fileName = $"{userId}/{id}{extWithDot}";
            var encodeId = Convert.ToBase64String(System.Text.Encoding.GetEncoding(28591).GetBytes(id));
            var blockclient = client.GetBlobContainerClient(this.containerName).GetBlockBlobClient(fileName);
            var item = await blockclient.CommitBlockListAsync(new List<string> { encodeId });
            return $"https://{ENV.AZURE_STORAGE_CDN}/{this.containerName}/{fileName}";

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
