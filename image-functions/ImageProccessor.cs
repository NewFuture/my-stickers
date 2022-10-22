using System;
using System.Collections.Generic;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ByteSizeLib;
using ImageMagick;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Azure.Messaging.EventGrid;
using System.IO;
using Azure.Messaging.EventGrid.SystemEvents;

namespace Stickers.ImageFunctions
{
    [StorageAccount("STICKERS_STORAGE")]
    public static class ImageProcessor
    {
        private const string LOG_TAG = $"{nameof(ImageProcessor)}.{nameof(Run)}";
        private const string IMAGE_PROCESSOR_VERSION_META = "ipv";
        private const long LATEST_IMAGE_PROCESSOR_VERSION = 1;
        private const int TARGET_SIZE = 256;
        private const int TARGET_COLORS = 256;
        private const string CacheControl = "public, max-age=604800, immutable";
        private static readonly Dictionary<MagickFormat, MagickFormat> FORMAT_MAPPING =
            new()
            {
                { MagickFormat.WebP, MagickFormat.Jpeg },
                { MagickFormat.WebM, MagickFormat.Gif },
            };

        // [FunctionName("ImageProcessor")]
        // public void Run(
        //     [BlobTrigger("stickers/{name}", Source = BlobTriggerSource.EventGrid)] BlobClient imageBlobClient,
        //     string name,
        //     ILogger log
        // )
        [FunctionName("ImageProcessor")]
        public static async Task Run(
            [EventGridTrigger] EventGridEvent eventGridEvent,
            [Blob("{data.url}", FileAccess.ReadWrite)] BlobClient imageBlobClient,
            ILogger log
        )
        {
            if (eventGridEvent == null || imageBlobClient == null)
            {
                log.LogError("Null arguments");
                return;
            }

            var eventData = eventGridEvent.Data.ToObjectFromJson<StorageBlobCreatedEventData>();
            var contentType = eventData.ContentType;

            if (!String.IsNullOrEmpty(contentType) && !contentType.StartsWith("image/")) { }

            var name = eventData.Url;
            // createdEvent.ContentType =
            log.LogDebug($"[{LOG_TAG}:{name}] triggered");
            using var _ = log.BeginScope($"{LOG_TAG}:{{name}}", new { name });
            try
            {
                // check version
                var metadata = (await imageBlobClient.GetPropertiesAsync()).Value.Metadata;
                if (
                    metadata.TryGetValue(IMAGE_PROCESSOR_VERSION_META, out var versionString)
                    && long.TryParse(versionString, out var version)
                    && version >= LATEST_IMAGE_PROCESSOR_VERSION
                )
                {
                    log.LogWarning(
                        $"no-ops due to detecting {IMAGE_PROCESSOR_VERSION_META} = {versionString} metadata"
                    );
                    return;
                }

                // read
                using var inImageBlobStream = await imageBlobClient.OpenReadAsync();
                using var images = new MagickImageCollection(inImageBlobStream);
                images.Coalesce();
                var pivot = images[0];
                log.LogInformation(
                    $"read image ({ByteSize.FromBytes(inImageBlobStream.Length)}, format: {pivot.Format}, size: {pivot.Width}x{pivot.Height}x{images.Count})"
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
                var outFormat = FORMAT_MAPPING.GetValueOrDefault(pivot.Format, pivot.Format);
                var outBytes = images.ToByteArray(outFormat);
                // write
                var compressionRatio = (double)outBytes.LongLength / inImageBlobStream.Length;
                var options = new BlobOpenWriteOptions()
                {
                    HttpHeaders = new()
                    {
                        ContentType = MagickFormatInfo.Create(outFormat)?.MimeType,
                        CacheControl = CacheControl,
                    },
                    Metadata = new Dictionary<string, string>()
                    {
                        { IMAGE_PROCESSOR_VERSION_META, LATEST_IMAGE_PROCESSOR_VERSION.ToString() },
                    },
                };
                using var outImageBlobStream = await imageBlobClient.OpenWriteAsync(true, options);
                await outImageBlobStream.WriteAsync(outBytes);
                log.LogInformation(
                    $"wrote blob ({ByteSize.FromBytes(outBytes.LongLength)}, format: {outFormat}, size: {pivot.Width}x{pivot.Height}x{images.Count}) with compression ratio: {compressionRatio:P2}"
                );
            }
            catch (Exception e)
            {
                log.LogError(e, $"{name} got exception: {e}");
                throw;
            }
        }
    }
}
