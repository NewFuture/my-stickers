using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using Stickers.Entities;
using Stickers.Search;
using Stickers.Service;

namespace Stickers.Controllers;

[ApiController]
[Route("[controller]")]
public class StickersController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<StickersController> _logger;
    private StickerStorage stickerStorage = null;
    private BlobService blobService = null;

    public StickersController(StickerStorage stickerStorage, BlobService blobService, ILogger<StickersController> logger)
    {
        this.stickerStorage = stickerStorage;
        this.blobService = blobService;
        _logger = logger;
    }

    [HttpPost(Name = "/stickers/commit")]
    public async Task<Sticker> Commit([FromQuery]string userId,[FromBody]PostStickerBlobRequest request)
    {
        string extendName = System.IO.Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(userId, request.id,extendName,request.contentType);
        var newSticker = new Sticker()
        {
            src = src,
            name = Path.GetFileNameWithoutExtension(request.name) + extendName,
            id = Guid.Parse(request.id)
        };
        var list = await this.stickerStorage.addUserStickers(userId, new List<Sticker>() { newSticker });
        return list[0];
        
    }
    [HttpGet(Name = "me/stickers")]
    public async Task<List<Sticker>> Get(Guid userId)
    {
        return await this.stickerStorage.getUserStickers(userId);
    }
    [HttpDelete(Name = "/stickers")]
    public async Task<bool> Delete(string id, Guid userId)
    {
        return await this.stickerStorage.deleteUserSticker(userId, id);
    }
    [HttpPatch(Name = "/stickers")]
    public async Task<bool> UpdateSticker(string id,string userId,string name)
    {
        return await this.stickerStorage.updateStickerName(userId, id, name);
    }

}
public class PostStickerBlobRequest
{
    public string id { get; set; }
    public string name { get; set; }
    public string contentType { get; set; }
}
