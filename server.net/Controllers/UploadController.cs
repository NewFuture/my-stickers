using Microsoft.AspNetCore.Mvc;
using Stickers.Service;

namespace Stickers.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerSession<UploadController>
{


    private readonly BlobService blobService;


    public UploadController(BlobService blobService, ILogger<UploadController> logger, SessionService sessionService) : base(sessionService, logger)
    {

        this.blobService = blobService;
    }


    [HttpPost("me")]
    public SasInfo[] Upload([FromBody] UploadRequest request)
    {
        var list = new List<SasInfo>();
        foreach (var item in request.exts)
        {
            var token = this.blobService.getSasToken(this.GetUserId(), item);
            list.Add(token);
        }
        return list.ToArray();
    }

    public class UploadRequest
    {
        public string[]? exts { get; set; }
    }
}

