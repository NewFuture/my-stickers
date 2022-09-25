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
    private StickerService stickerService;
    private BlobService blobService;
    private IHttpContextAccessor httpContextAccessor = null;

    public AdminStickersController(StickerService stickers, BlobService blobService, ILogger<StickersController> logger, IHttpContextAccessor httpContextAccessor)
    {
        this.stickerService = stickers;
        this.blobService = blobService;
        _logger = logger;
        this.httpContextAccessor = httpContextAccessor;
    }
    private Guid GetTenantId()
    {
        var id = this.httpContextAccessor.HttpContext?.User.FindFirstValue("http://schemas.microsoft.com/identity/claims/tenantid");
        if (String.IsNullOrWhiteSpace(id))
        {
            throw new UnauthorizedAccessException("cannot get tenant form token");
        }
        return new Guid(id);
    }
    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var tenantId = this.GetTenantId();
        string extendName = System.IO.Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(tenantId, request.id, extendName, request.contentType);
        var newSticker = new Sticker()
        {
            src = src,
            name = Path.GetFileNameWithoutExtension(request.name) + extendName,
            id = Guid.Parse(request.id)
        };
        var list = await this.stickerService.addTenantStickers(tenantId, new List<Sticker>() { newSticker });
        return list[0];

    }
    [HttpGet]
    public async Task<Page<Sticker>> Get()
    {
        var tenantId = this.GetTenantId();
        var stickers = await this.stickerService.getTenantStickers(tenantId);
        return new Page<Sticker>(stickers);
    }
    [HttpDelete("{id}")]
    public async Task<Result> Delete(string id)
    {
        var tenantId = this.GetTenantId();
        var result = await this.stickerService.deleteTanentSticker(tenantId, id);
        return new Result(result);
    }
    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, [FromBody] PatchStickerRequest request)
    {
        var tenantId = this.GetTenantId();
        var result = await this.stickerService.updateTenantSticker(tenantId, id, request);
        return new Result(result);
    }

}

