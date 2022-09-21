using Microsoft.AspNetCore.Mvc;
using Stickers.Service;

namespace Stickers.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{

    private readonly ILogger<StickersController> _logger;
    private readonly BlobService blobService;

    public UploadController(BlobService blobService, ILogger<StickersController> logger)
    {
        _logger = logger;
        this.blobService = blobService;
    }


    [HttpPost(Name = "upload")]
    public async Task<SasInfo[]> Upload([FromBody] UploadRequest request)
    {
        var list = new List<SasInfo>();
        foreach (var item in request.exts)
        {
            var token = await this.blobService.getSasToken(request.user, item);
            list.Add(token);
        }
        return list.ToArray();
    }
    public class UploadRequest
    {
        public string? user { get; set; }
        public string? token { get; set; }
        public string[]? exts { get; set; }
    }
}

