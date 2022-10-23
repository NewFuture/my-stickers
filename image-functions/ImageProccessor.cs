namespace Stickers.ImageFunctions;

using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ByteSizeLib;
using ImageMagick;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

public static class ImageProcessor
{
    private const string LOG_TAG = $"{nameof(ImageProcessor)}.{nameof(Run)}";
    private const string VERSION_KEY = "ipv";
    private const long LATEST_IMAGE_PROCESSOR_VERSION = 1;
    private const int TARGET_SIZE = 256;
    private const int TARGET_COLORS = 256;
    private const string CacheControl = "public, max-age=604800, immutable";

    /// <summary>
    /// The image type can be disable in Teams
    /// https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html
    /// </summary>
    private static readonly HashSet<string> COMPATIBLE_CONTENT_TYPES =
        new() { "image/png", "image/gif", "image/jpeg", "image/jpg", };

    /// <summary>
    /// IMAGE format mapping
    /// </summary>
    private static readonly Dictionary<MagickFormat, MagickFormat> FORMAT_MAPPING =
        new()
        {
            // pngs
            { MagickFormat.Png, MagickFormat.Png },
            { MagickFormat.Png8, MagickFormat.Png8 },
            { MagickFormat.Png24, MagickFormat.Png24 },
            { MagickFormat.Png32, MagickFormat.Png32 },
            { MagickFormat.Png48, MagickFormat.Png48 },
            { MagickFormat.Png64, MagickFormat.Png64 },
            { MagickFormat.Png00, MagickFormat.Png00 },
            { MagickFormat.Jng, MagickFormat.Png },
            { MagickFormat.WebP, MagickFormat.Png },
            { MagickFormat.Svg, MagickFormat.Png },
            // jpgs
            { MagickFormat.Bmp, MagickFormat.Jpeg },
            { MagickFormat.Bmp2, MagickFormat.Jpeg },
            { MagickFormat.Bmp3, MagickFormat.Jpeg },
            { MagickFormat.Cmyk, MagickFormat.Jpeg },
            { MagickFormat.Jpg, MagickFormat.Jpg },
            { MagickFormat.Jpeg, MagickFormat.Jpeg },
            { MagickFormat.J2c, MagickFormat.Jpeg },
            { MagickFormat.J2k, MagickFormat.Jpeg },
            { MagickFormat.Jp2, MagickFormat.Jpeg },
            { MagickFormat.Jpe, MagickFormat.Jpeg },
            { MagickFormat.Jpm, MagickFormat.Jpeg },
            { MagickFormat.Jps, MagickFormat.Jpeg },
            { MagickFormat.Jpt, MagickFormat.Jpeg },
            { MagickFormat.Tif, MagickFormat.Jpeg },
            { MagickFormat.Tiff, MagickFormat.Jpeg },
            { MagickFormat.Tiff64, MagickFormat.Jpeg },
            { MagickFormat.Rgb, MagickFormat.Jpeg },
            // gifs
            { MagickFormat.Gif, MagickFormat.Gif },
            { MagickFormat.Gif87, MagickFormat.Gif87 },
            { MagickFormat.WebM, MagickFormat.Gif },
            { MagickFormat.APng, MagickFormat.Gif },
            { MagickFormat.Avif, MagickFormat.Gif },
            { MagickFormat.M2v, MagickFormat.Gif },
            { MagickFormat.M4v, MagickFormat.Gif },
            { MagickFormat.Mp4, MagickFormat.Gif },
        };

    private static readonly Dictionary<string, string> Metadata =
        new() { { VERSION_KEY, LATEST_IMAGE_PROCESSOR_VERSION.ToString() }, };

    // [FunctionName("ImageProcessor")]
    // public void Run(
    //     [BlobTrigger("stickers/{name}", Source = BlobTriggerSource.EventGrid)] BlobClient imageBlobClient,
    //     string name,
    //     ILogger log
    // )

    /// <summary>
    /// auto resize, compress and covert the images
    /// </summary>
    /// <param name="eventGridEvent"></param>
    /// <param name="imageBlobClient"></param>
    /// <param name="logger"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [FunctionName("ImageProcessor")]
    public static async Task Run(
        [EventGridTrigger] EventGridEvent eventGridEvent,
        [Blob("{data.url}", FileAccess.ReadWrite, Connection = "STICKERS_STORAGE")]
            BlobClient imageBlobClient,
        ILogger logger,
        CancellationToken cancellationToken
    )
    {
        if (eventGridEvent == null || imageBlobClient == null)
        {
            logger.LogError("Null arguments");
            return;
        }

        var eventData = eventGridEvent.Data.ToObjectFromJson<StorageBlobCreatedEventData>();
        var name = eventData.Url;
        logger.LogDebug($"[{LOG_TAG}:{name}] ({eventData.ContentType}) triggered");
        using var _ = logger.BeginScope($"{LOG_TAG}:{{name}}", new { name });
        try
        {
            // check version
            var properties = (
                await imageBlobClient.GetPropertiesAsync(cancellationToken: cancellationToken)
            );
            if (
                properties.Value.Metadata.TryGetValue(VERSION_KEY, out var versionString)
                && long.TryParse(versionString, out var version)
                && version >= LATEST_IMAGE_PROCESSOR_VERSION
            )
            {
                logger.LogWarning(
                    $"no-ops due to detecting {VERSION_KEY} = {versionString} metadata"
                );
                return;
            }

            // read
            using var inImageBlobStream = await imageBlobClient.OpenReadAsync(
                cancellationToken: cancellationToken
            );
            var (mimeType, outBytes, originFormat) = ProcessImage(inImageBlobStream, logger);

            // write
            var compressionRatio = (double)outBytes.LongLength / inImageBlobStream.Length;
            if (
                COMPATIBLE_CONTENT_TYPES.Contains(originFormat.MimeType) && compressionRatio >= 0.99
            )
            {
                // keep the origin data
                await imageBlobClient.SetHttpHeadersAsync(
                    new() { CacheControl = CacheControl, ContentType = originFormat.MimeType },
                    cancellationToken: cancellationToken
                );
                await imageBlobClient.SetMetadataAsync(
                    Metadata,
                    cancellationToken: cancellationToken
                );
                logger.LogInformation(
                    $"keep the origin image, format: {originFormat.MimeType}({originFormat.Format}) for compression ratio: {compressionRatio:P2}"
                );
            }
            else
            {
                await SaveBlob(imageBlobClient, outBytes, mimeType, cancellationToken);
                logger.LogInformation(
                    $"wrote blob ({ByteSize.FromBytes(outBytes.LongLength)}, type: {mimeType} with compression ratio: {compressionRatio:P2}"
                );
            }
        }
        catch (Exception e)
        {
            logger.LogError(e, $"{name} got exception: {e}");
            throw;
        }
    }

    /// <summary>
    /// read image form stream and covert it
    /// </summary>
    /// <param name="blobStream"></param>
    /// <param name="logger"></param>
    /// <returns></returns>

    private static (string mimeType, byte[] data, IMagickFormatInfo originFormatInfo) ProcessImage(
        Stream blobStream,
        ILogger logger
    )
    {
        using var images = new MagickImageCollection(blobStream);
        var originFormatInfo = MagickFormatInfo.Create(images[0].Format);
        images.Coalesce();
        var pivot = images[0];
        logger.LogInformation(
            $"read image ({ByteSize.FromBytes(blobStream.Length)}, format: {pivot.Format}, size: {pivot.Width}x{pivot.Height}x{images.Count})"
        );

        // resize
        if (pivot.Width > TARGET_SIZE || pivot.Height > TARGET_SIZE)
        {
            foreach (var image in images)
            {
                image.AdaptiveResize(TARGET_SIZE, TARGET_SIZE);
            }
        }

        // quantize
        var settings = new QuantizeSettings()
        {
            Colors = TARGET_COLORS,
            DitherMethod = DitherMethod.FloydSteinberg,
        };
        images.Quantize(settings);

        // optimize
        images.OptimizePlus();
        images.OptimizeTransparency();

        // convert
        pivot = images[0];
        if (!FORMAT_MAPPING.TryGetValue(originFormatInfo.Format, out var outFormat))
        {
            if (COMPATIBLE_CONTENT_TYPES.Contains(originFormatInfo.MimeType))
            {
                outFormat = originFormatInfo.Format;
            }
            else if (originFormatInfo.IsMultiFrame)
            {
                outFormat = MagickFormat.Gif;
            }
            else
            {
                outFormat = MagickFormat.Png;
            }
        }
        var outBytes = images.ToByteArray(outFormat);
        logger.LogInformation(
            $"covert to ({ByteSize.FromBytes(outBytes.LongLength)}, format: {outFormat}, size: {pivot.Width}x{pivot.Height}x{images.Count})"
        );
        var contentType = MagickFormatInfo.Create(outFormat)?.MimeType;

        return (contentType, outBytes, originFormatInfo);
    }

    /// <summary>
    /// save data to blob
    /// </summary>
    /// <param name="blobClient"></param>
    /// <param name="data"></param>
    /// <param name="contentType"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private static async Task SaveBlob(
        BlobClient blobClient,
        byte[] data,
        string contentType,
        CancellationToken cancellationToken
    )
    {
        var options = new BlobOpenWriteOptions()
        {
            HttpHeaders = new() { ContentType = contentType, CacheControl = CacheControl, },
            Metadata = Metadata
        };
        using var outImageBlobStream = await blobClient.OpenWriteAsync(
            true,
            options,
            cancellationToken: cancellationToken
        );
        await outImageBlobStream.WriteAsync(data, cancellationToken: cancellationToken);
    }
}
