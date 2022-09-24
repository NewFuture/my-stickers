using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Service;
using System.Security.Claims;

namespace Stickers.Controllers;

[ApiController]
[Route("api/me/stickers")]
public class StickersController : ControllerSession<StickersController>
{

    private StickerStorage stickerStorage;
    private BlobService blobService;
    private IHttpContextAccessor httpContextAccessor;

    public StickersController(StickerStorage stickerStorage, BlobService blobService, ILogger<StickersController> logger, IHttpContextAccessor httpContextAccessor, SessionService sessionService) : base(sessionService, logger)
    {
        this.stickerStorage = stickerStorage;
        this.blobService = blobService;
        this.httpContextAccessor = httpContextAccessor;

    }

    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var userId = GetUserId();
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
    [HttpGet("/api/me/stickers")]
    public async Task<Page<Sticker>> Get()
    {
        var userId = this.GetUserId();
        var stickers = await this.stickerStorage.getUserStickers(userId);
        return new Page<Sticker>(stickers);
    }
    [HttpDelete("{id}")]
    public async Task<Result> Delete(string id)
    {
        var userId = this.GetUserId();
        var result = await this.stickerStorage.deleteUserSticker(userId, id);
        return new Result(result);
    }

    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, string name)
    {
        var userId = this.GetUserId();
        var result = await this.stickerStorage.updateStickerName(userId, id, name);
        return new Result(result);
    }

}
public class PostStickerBlobRequest
{
    public string? id { get; set; }
    public string? name { get; set; }
    public string? contentType { get; set; }
}
