using System.IO;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Stickers.ImageFunctions
{
    public class ImageProcessor
    {
        [FunctionName("ImageProcessor")]
        public void Run([BlobTrigger("stickers/{name}", Connection = "stickersblob_STORAGE")]Stream imageBlob, string name, ILogger log)
        {
            log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {imageBlob.Length} Bytes");
        }
    }
}
