namespace Stickers.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Service;
using Stickers.Utils;

[ApiController]
[Authorize(AuthenticationSchemes = ENV.ID_TOKEN_DEFINITION)]
[Route("api/admin/stickers")]
public class TenantStickersController : ControllerBase
{
    private readonly ILogger<UserStickersController> logger;
    private StickerService stickerService;
    private BlobService blobService;
    private IHttpContextAccessor httpContextAccessor;

    public TenantStickersController(
        StickerService stickers,
        BlobService blobService,
        ILogger<UserStickersController> logger,
        IHttpContextAccessor httpContextAccessor
    )
    {
        this.stickerService = stickers;
        this.blobService = blobService;
        this.logger = logger;
        this.httpContextAccessor = httpContextAccessor;
    }

    private Guid GetTenantId()
    {
        var id = this.httpContextAccessor.HttpContext?.User.FindFirstValue(
            "http://schemas.microsoft.com/identity/claims/tenantid"
        );
        if (String.IsNullOrWhiteSpace(id))
        {
            throw new UnauthorizedAccessException("cannot get tenant form token");
        }
        return new Guid(id);
    }

    [HttpGet]
    public async Task<Page<Sticker>> Get()
    {
        var tenantId = this.GetTenantId();
        var stickers = await this.stickerService.getTenantStickers(tenantId);
        return new Page<Sticker>(stickers);
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    public async Task<Result> Delete(string id)
    {
        var tenantId = this.GetTenantId();
        var result = await this.stickerService.deleteTanentSticker(tenantId, id);
        return new Result(result);
    }

    [HttpPatch("{id}")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    public async Task<Result> UpdateSticker(string id, [FromBody] PatchStickerRequest request)
    {
        var tenantId = this.GetTenantId();
        var result = await this.stickerService.updateTenantSticker(tenantId, id, request);
        return new Result(result);
    }

    [HttpPost("upload")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    public IEnumerable<SasInfo> UploadTenant([FromBody] UploadRequest request)
    {
        var tenantId = this.GetTenantId();
        var list = new List<SasInfo>();
        foreach (var item in request.exts!)
        {
            var token = this.blobService.getSasToken(tenantId, item);
            list.Add(token);
        }
        return list;
    }

    [HttpPost("commit")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var tenantId = this.GetTenantId();
        string? extendName = Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(
            tenantId,
            request.id,
            extendName,
            request.contentType
        );
        var newSticker = new Sticker()
        {
            src = src,
            name = Path.GetFileNameWithoutExtension(request.name),
            id = request.id,
        };
        var list = await this.stickerService.addTenantStickers(
            tenantId,
            new List<Sticker>() { newSticker },
            false
        );
        return list[0];
    }
}
