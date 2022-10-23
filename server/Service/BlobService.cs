namespace Stickers.Service;

using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Stickers.Utils;

public class BlobService
{
    private readonly BlobServiceClient client;
    private readonly string containerName = "stickers";
    private readonly string cdn;
    private static readonly Encoding encoding = Encoding.GetEncoding(28591);

    public const string CacheControl = "max-age=90";

    private readonly string[] supportExtList = new string[] { "png", "gif", "jpg", "jpeg" };

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
        if (this.supportExtList.Contains(ext))
        {
            // add ext
            fileName += $".{ext}";
        }

        BlobSasBuilder sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = containerName,
            BlobName = fileName,
            ExpiresOn = DateTime.Now.AddMinutes(10)
        };
        sasBuilder.SetPermissions(BlobAccountSasPermissions.All);
        var containerClient = this.client.GetBlobContainerClient(this.containerName);
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
            || !this.supportExtList.Contains(extWithDot.TrimStart('.'))
        )
        {
            // remove ext
            extWithDot = "";
        }
        string fileName = $"{EncodeGuid(userId)}/{EncodeGuid(id)}{extWithDot}";
        var encodeId = Convert.ToBase64String(encoding.GetBytes(id.ToString()));
        var blockclient = this.client
            .GetBlobContainerClient(this.containerName)
            .GetBlockBlobClient(fileName);
        await blockclient.CommitBlockListAsync(
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
        return encoded[..22];
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
