using System;
using System.Collections.Generic;
using System.IO;
using ByteSizeLib;
using ImageMagick;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Stickers.ImageFunctions
{
    public class ImageProcessor
    {
        private const string TAG = $"{nameof(ImageProcessor)}.{nameof(Run)}";
        private const int TARGET_SIZE = 256;
        private static readonly Dictionary<MagickFormat, MagickFormat> FORMAT_MAPPING = new()
        {
            { MagickFormat.WebP, MagickFormat.Jpeg },
            { MagickFormat.WebM, MagickFormat.Gif },
        };

        [FunctionName("ImageProcessor")]
        public void Run([BlobTrigger("stickers/{name}", Connection = "stickersblob_STORAGE")] Stream imageBlob,
                        [Blob("processed-stickers/{name}", FileAccess.Write)] Stream outImageBlob,
                        string name, ILogger log)
        {
            var logPrefix = $"[{TAG}/{name}]";
            try
            {
                log.LogInformation($"{logPrefix} triggered by blob ({ByteSize.FromBytes(imageBlob.Length)})");

                // read
                using var images = new MagickImageCollection(imageBlob);
                images.Coalesce();
                var pivot = images[0];
                log.LogInformation($"{logPrefix} read image (format: {pivot.Format}, size: {pivot.Width}x{pivot.Height}x{images.Count})");

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
                    Colors = 64,
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
                log.LogInformation($"{logPrefix} processed image (format: {outFormat}, size: {pivot.Width}x{pivot.Height}x{images.Count})");

                // write
                var compressionRatio = (double)outBytes.LongLength / imageBlob.Length;
                outImageBlob.Write(outBytes);
                log.LogInformation($"{logPrefix} wrote blob ({ByteSize.FromBytes(outBytes.LongLength)}) with compression ratio: {compressionRatio:P2}");
            }
            catch (Exception e)
            {
                log.LogError(e, $"{logPrefix} exception occurred, {e}");
            }
        }
    }
}
