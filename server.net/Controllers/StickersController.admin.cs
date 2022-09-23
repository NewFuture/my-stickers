using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Service;
using System.Security.Claims;

namespace Stickers.Controllers;

[ApiController]
[Route("api/admin/stickers")]
[Authorize]
public class AdminStickersController : ControllerBase
{


    private readonly ILogger<StickersController> _logger;
    private StickerStorage stickerStorage;
    private BlobService blobService;
    private string tableName;
    private IHttpContextAccessor httpContextAccessor = null;

    public AdminStickersController(StickerStorage stickerStorage, BlobService blobService, ILogger<StickersController> logger, IHttpContextAccessor httpContextAccessor)
    {
        this.stickerStorage = stickerStorage;
        this.blobService = blobService;
        this.stickerStorage.SetAdmin();
        _logger = logger;
        this.httpContextAccessor = httpContextAccessor;
   }
    private Guid GetUserId()
    {
        var userId = this.httpContextAccessor.HttpContext?.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/tenantid");
        return new Guid(userId);
    }
    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromQuery] Guid userId, [FromBody] PostStickerBlobRequest request)
    {
        userId = this.GetUserId();
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
    public async Task<Page<Sticker>> Get(Guid userId)
    {
        userId = this.GetUserId();
        var stickers = await this.stickerStorage.getUserStickers(userId);
        return new Page<Sticker>(stickers);
    }
    [HttpDelete("{id}")]
    public async Task<Result> Delete(string id, Guid userId)
    {
        userId = this.GetUserId();
        var result = await this.stickerStorage.deleteUserSticker(userId, id);
        return new Result(result);
    }
    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, Guid userId, string name)
    {
        userId = this.GetUserId();
        var result = await this.stickerStorage.updateStickerName(userId, id, name);
        return new Result(result);
    }

}

