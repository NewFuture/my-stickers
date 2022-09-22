using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Search;
using Stickers.Service;

namespace Stickers.Controllers;

[ApiController]
[Route("api/admin/stickers")]
public class AdminStickersController : ControllerBase
{


    private readonly ILogger<StickersController> _logger;
    private StickerStorage stickerStorage;
    private BlobService blobService;
    private string tableName;

    public AdminStickersController(StickerStorage stickerStorage, BlobService blobService, ILogger<StickersController> logger)
    {
        this.stickerStorage = stickerStorage;
        this.blobService = blobService;
        this.stickerStorage.SetAdmin();
        _logger = logger;
   }
    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromQuery] string userId, [FromBody] PostStickerBlobRequest request)
    {
        string extendName = System.IO.Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(userId, request.id, extendName, request.contentType);
        var newSticker = new Sticker()
        {
            src = src,
            name = Path.GetFileNameWithoutExtension(request.name) + extendName,
            id = Guid.Parse(request.id)
        };
        var list = await this.stickerStorage.addUserStickers(userId, new List<Sticker>() { newSticker });
        return list[0];

    }
    [HttpGet("/api/admin/stickers")]
    public async Task<List<Sticker>> Get(Guid userId)
    {
        return await this.stickerStorage.getUserStickers(userId);
    }
    [HttpDelete("{id}")]
    public async Task<bool> Delete(string id, Guid userId)
    {
        return await this.stickerStorage.deleteUserSticker(userId, id);
    }
    [HttpPatch("{id}")]
    public async Task<bool> UpdateSticker(string id, string userId, string name)
    {
        return await this.stickerStorage.updateStickerName(userId, id, name);
    }

}

