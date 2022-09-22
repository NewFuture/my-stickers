using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Search;
using Stickers.Service;
using System.Security.Claims;

namespace Stickers.Controllers;

[ApiController]
[Route("api/me/stickers")]
public class StickersController : ControllerBase
{


    private readonly ILogger<StickersController> _logger;
    private StickerStorage stickerStorage;
    private BlobService blobService;
    private IHttpContextAccessor httpContextAccessor = null;

    public StickersController(StickerStorage stickerStorage, BlobService blobService, ILogger<StickersController> logger, IHttpContextAccessor httpContextAccessor)
    {
        this.stickerStorage = stickerStorage;
        this.blobService = blobService;
        _logger = logger;
        this.httpContextAccessor = httpContextAccessor;
    }
    public Guid GetUserId(Guid oldId)
    {
        //var userId = this.httpContextAccessor.HttpContext?.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier");
        //return new Guid(userId);

        //should call hulin's function
        return oldId;
    }

    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromQuery]Guid userId, [FromBody] PostStickerBlobRequest request)
    {
        userId = GetUserId(userId);
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
    public async Task<List<Sticker>> Get(Guid userId)
    {
        userId = GetUserId(userId);
        return await this.stickerStorage.getUserStickers(userId);
    }
    [HttpDelete("{id}")]
    public async Task<bool> Delete(string id, Guid userId)
    {
        userId = GetUserId(userId);
        return await this.stickerStorage.deleteUserSticker(userId, id);
    }
    [HttpPatch("{id}")]
    public async Task<bool> UpdateSticker(string id, Guid userId, string name)
    {
        userId = GetUserId(userId);
        return await this.stickerStorage.updateStickerName(userId, id, name);
    }

}
public class PostStickerBlobRequest
{
    public string? id { get; set; }
    public string? name { get; set; }
    public string? contentType { get; set; }
}
