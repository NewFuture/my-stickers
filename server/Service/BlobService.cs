using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Stickers.Utils;
using System.Text;

namespace Stickers.Service;

public class BlobService
{
    private BlobServiceClient client;
    private string containerName = "stickers";
    private string cdn;
    private static Encoding encoding = Encoding.GetEncoding(28591);

    public const string CacheControl = "max-age=90";

    private string[] supportExtList = new string[] { "png", "gif", "jpg", "jpeg" };

    public BlobService(BlobServiceClient client, IConfiguration configuration)
    {
        this.client = client;
        this.cdn = configuration[ConfigKeys.CDN_DOMAIN];
    }

    public SasInfo getSasToken(Guid userId, string ext)
    {
        var id = Guid.NewGuid();
        ext = ext.ToLower();
        string fileName = $"{EncodeGuid(userId)}/{EncodeGuid(id)}";
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
        Guid id,
        string? extWithDot,
        string? contentType
    )
    {
        if (
            string.IsNullOrWhiteSpace(extWithDot)
            || !supportExtList.Contains(extWithDot.TrimStart('.'))
        )
        {
            // remove ext
            extWithDot = "";
        }
        string fileName = $"{EncodeGuid(userId)}/{EncodeGuid(id)}{extWithDot}";
        var encodeId = Convert.ToBase64String(encoding.GetBytes(id.ToString()));
        var blockclient = client
            .GetBlobContainerClient(this.containerName)
            .GetBlockBlobClient(fileName);
        var item = await blockclient.CommitBlockListAsync(
            new List<string> { encodeId },
            new BlobHttpHeaders { ContentType = contentType, CacheControl = CacheControl, }
        );
        return $"https://{this.cdn}/{this.containerName}/{fileName}";
    }

    /// <summary>
    /// Guid to Short Base64
    /// 540c2d5f-a9ab-4414-bd36-9999f5388773 ==> Xy0MVKupFES9NpmZ9TiHcw
    /// here is a breaking change for v1
    /// v2 use default byte encode (little-endian)
    /// </summary>
    /// <param name="guid"></param>
    /// <returns></returns>
    private static string EncodeGuid(Guid guid)
    {
        string encoded = Convert.ToBase64String(guid.ToByteArray());
        encoded = encoded.Replace('/', '_').Replace('+', '-');
        return encoded.Substring(0, 22);
    }
}

public class SasInfo
{
    /**
     * Base64编码的ID
     */
    public Guid? id { get; set; }

    public string? token { get; set; }
    public string? url { get; set; }
}
