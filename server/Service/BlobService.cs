namespace Stickers.Service;

using System.Text;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Utils;

public class BlobService
{
    public const string CacheControl = "max-age=90";

    private static readonly Encoding encoding = Encoding.GetEncoding(28591);

    private const BlobSasPermissions PERMISSIONS =
        BlobSasPermissions.Read | BlobSasPermissions.Write | BlobSasPermissions.Delete;

    private readonly ILogger<BlobService> logger;

    private readonly string cdn;

    private readonly string containerName;

    private readonly string[] supportedExtList = new string[] { "png", "gif", "jpg", "jpeg" };

    private BlobContainerClient ContainerClient { get; init; }

    public BlobService(
        BlobServiceClient client,
        IConfiguration configuration,
        ILogger<BlobService> logger
    )
    {
        // this.client = client;
        this.cdn = configuration[ConfigKeys.CDN_DOMAIN];
        this.containerName = configuration[ConfigKeys.BLOB_CONTAINER];
        this.ContainerClient = client.GetBlobContainerClient(this.containerName);
        this.logger = logger;
    }

    public List<SasInfo> BatchSasToken(Guid id, string[] exts)
    {
        var list = new List<SasInfo>();
        foreach (var item in exts!)
        {
            var token = this.getSasToken(id, item);
            list.Add(token);
        }
        return list;
    }

    public async Task<bool> Delete(Guid id, Guid fileId, string fileUrl)
    {
        var uri = new Uri(fileUrl);
        if (uri.Host != this.cdn)
        {
            // not hosted images
            return false;
        }
        var prefix = $"/{this.containerName}/";
        if (!uri.AbsolutePath.StartsWith(prefix + this.GetFileName(id, fileId, "")))
        {
            // not this image
            return false;
        }
        var fileName = uri.AbsolutePath[prefix.Length..];
        var blockclient = this.ContainerClient.GetBlockBlobClient(fileName);
        var response = await blockclient.DeleteIfExistsAsync();
        return response.Value;
    }

    public async Task<string> commitBlocks(Guid userId, PostStickerBlobRequest req)
    {
        var id = req.id;
        string fileName = this.GetFileName(userId, id, Path.GetExtension(req.name));
        var blockId = Convert.ToBase64String(encoding.GetBytes(id.ToString()));

        this.logger.LogInformation("start commit {fileName} with {blockId}", fileName, blockId);
        var blockclient = this.ContainerClient.GetBlockBlobClient(fileName);

        await blockclient.CommitBlockListAsync(
            new List<string> { blockId },
            new BlobHttpHeaders { ContentType = req.contentType, CacheControl = CacheControl, }
        );
        return $"https://{this.cdn}/{this.containerName}/{fileName}";
    }

    public async Task<Sticker[]> BatchCommitBlocks(Guid userId, PostStickerBlobRequest[] requests)
    {
        var tasks = requests.Select(
            async (req, index) =>
            {
                try
                {
                    var src = await this.commitBlocks(userId, req);
                    return new Sticker()
                    {
                        id = req.id,
                        name = Path.GetFileNameWithoutExtension(req.name),
                        src = src,
                        weight = req.weight,
                    };
                }
                catch (Exception err)
                {
                    this.logger.LogError(err, "commit blob failed");
                    return new Sticker() { id = req.id, name = err.Message };
                }
            }
        );
        return await Task.WhenAll(tasks.ToArray());
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

    private string GetFileName(Guid userId, Guid fileId, string? ext)
    {
        ext = ext?.TrimStart('.').ToLower();
        if (this.supportedExtList.Contains(ext))
        {
            ext = $".{ext}"; // add dot
        }
        else
        {
            ext = ""; // remove ext
        }
        return $"{EncodeGuid(userId)}/{EncodeGuid(fileId)}{ext}";
    }

    private SasInfo getSasToken(Guid userId, string ext)
    {
        var id = Guid.NewGuid();
        string fileName = this.GetFileName(userId, id, ext);
        BlobSasBuilder sasBuilder = new BlobSasBuilder(PERMISSIONS, DateTime.Now.AddMinutes(10))
        {
            BlobContainerName = containerName,
            BlobName = fileName,
        };
        var blockClient = this.ContainerClient.GetBlockBlobClient(fileName);
        Uri sasUri = blockClient.GenerateSasUri(sasBuilder);
        return new SasInfo(id, sasUri.ToString());
    }
}
