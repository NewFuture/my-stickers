using System;
using System.Collections.Generic;
using System.Diagnostics;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ByteSizeLib;
using ImageMagick;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Stickers.ImageFunctions
{
    [StorageAccount("STICKERS_STORAGE")]
    public class ImageProcessor
    {
        private const string LOG_TAG = $"{nameof(ImageProcessor)}.{nameof(Run)}";
        private const string IMAGE_PROCESSOR_VERSION_META = "ipv";
        private const long LATEST_IMAGE_PROCESSOR_VERSION = 1;
        private const int TARGET_SIZE = 256;
        private const int TARGET_COLORS = 256;
        private static readonly Dictionary<MagickFormat, MagickFormat> FORMAT_MAPPING =
            new()
            {
                { MagickFormat.WebP, MagickFormat.Jpeg },
                { MagickFormat.WebM, MagickFormat.Gif },
            };

        [FunctionName("ImageProcessor")]
        public void Run(
            [BlobTrigger("stickers/{name}")] BlobClient imageBlobClient,
            string name,
            ILogger log
        )
        {
            var stopWatch = new Stopwatch();
            var logPrefix = $"[{LOG_TAG}/{name}]";
            try
            {
                stopWatch.Start();
                log.LogInformation($"{logPrefix} triggered");

                // check
                var metadata = imageBlobClient.GetProperties().Value.Metadata;
                string versionString;
                long version;
                if (
                    metadata.TryGetValue(IMAGE_PROCESSOR_VERSION_META, out versionString)
                    && long.TryParse(versionString, out version)
                    && version >= LATEST_IMAGE_PROCESSOR_VERSION
                )
                {
                    log.LogInformation(
                        $"{logPrefix} no-ops due to detecting {IMAGE_PROCESSOR_VERSION_META} metadata"
                    );
                    return;
                }

                // read
                using var inImageBlobStream = imageBlobClient.OpenRead();
                using var images = new MagickImageCollection(inImageBlobStream);
                images.Coalesce();
                var pivot = images[0];
                log.LogInformation(
                    $"{logPrefix} read image ({ByteSize.FromBytes(inImageBlobStream.Length)}, format: {pivot.Format}, size: {pivot.Width}x{pivot.Height}x{images.Count})"
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
                        CacheControl = "public, max-age=604800, immutable",
                    },
                    Metadata = new Dictionary<string, string>()
                    {
                        { IMAGE_PROCESSOR_VERSION_META, LATEST_IMAGE_PROCESSOR_VERSION.ToString() },
                    },
                };
                using var outImageBlobStream = imageBlobClient.OpenWrite(true, options);
                outImageBlobStream.Write(outBytes);
                stopWatch.Stop();
                log.LogInformation(
                    $"{logPrefix} wrote blob ({ByteSize.FromBytes(outBytes.LongLength)}, format: {outFormat}, size: {pivot.Width}x{pivot.Height}x{images.Count}) with compression ratio: {compressionRatio:P2}"
                );
                log.LogInformation($"{logPrefix} elapsed {stopWatch.Elapsed:s\\.fff} seconds");
            }
            catch (Exception e)
            {
                stopWatch.Stop();
                log.LogError(e, $"{logPrefix} exception occurred, after {stopWatch.Elapsed:s\\.fff} seconds");
                throw;
            }
        }
    }
}
