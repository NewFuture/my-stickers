using System;
using System.Collections.Generic;
using System.IO;
using ImageMagick;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Stickers.ImageFunctions
{
    public class ImageProcessor
    {
        private const string TAG = $"{nameof(ImageProcessor)}.{nameof(Run)}";
        private const int TARGET_SIZE = 400;
        private static readonly Dictionary<MagickFormat, MagickFormat> FORMAT_MAPPING = new Dictionary<MagickFormat, MagickFormat>()
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
                log.LogInformation($"{logPrefix} triggered by blob ({imageBlob.Length} bytes)");

                using var collection = new MagickImageCollection(imageBlob);
                var pivot = collection[0];
                log.LogInformation($"{logPrefix} reads image (format: {pivot.Format}, size: {pivot.Width}x{pivot.Height}x{collection.Count})");

                if (pivot.Width > TARGET_SIZE || pivot.Height > TARGET_SIZE)
                {
                    foreach (var image in collection)
                    {
                        image.AdaptiveResize(TARGET_SIZE, TARGET_SIZE);
                    }
                }
                collection.OptimizePlus();
                collection.OptimizeTransparency();

                pivot = collection[0];
                var outFormat = FORMAT_MAPPING.GetValueOrDefault(pivot.Format, pivot.Format);
                var outBytes = collection.ToByteArray(outFormat);
                log.LogInformation($"{logPrefix} processed image (format: {outFormat}, size: {pivot.Width}x{pivot.Height}x{collection.Count})");

                var compressionRatio = (double)outBytes.Length / imageBlob.Length;
                if (compressionRatio >= 1)
                {
                    imageBlob.Seek(0, SeekOrigin.Begin);
                    imageBlob.CopyTo(outImageBlob);
                    log.LogInformation($"{logPrefix} outputs blob originally, compression ratio: 1.0");
                }
                else
                {
                    outImageBlob.Write(outBytes);
                    log.LogInformation($"{logPrefix} outputs blob ({outBytes.Length} bytes), compression ratio: {compressionRatio}");
                }
            }
            catch (Exception e)
            {
                log.LogError(e, $"{logPrefix} exception occurred, {e}");
            }
        }
    }
}
