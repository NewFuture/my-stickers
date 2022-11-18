namespace Stickers.Controllers;

using System.Security.Claims;
using Microsoft.ApplicationInsights.DataContracts;
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
    private readonly StickerService stickerService;
    private readonly BlobService blobService;
    private readonly IHttpContextAccessor httpContextAccessor;

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
        var context = this.httpContextAccessor.HttpContext;
        var id = context?.User.FindFirstValue(
            "http://schemas.microsoft.com/identity/claims/tenantid"
        );
        if (String.IsNullOrWhiteSpace(id))
        {
            this.logger.LogError("failed to got tid from token");
            throw new UnauthorizedAccessException("cannot get tenant form token");
        }
        var requestTelemetry = context?.Features.Get<RequestTelemetry>();
        if (requestTelemetry != null)
        {
            requestTelemetry.Properties.Add("tenantId", id);
            requestTelemetry.Context.User.Id = context?.User.FindFirstValue("oid");
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
        var exts = request?.exts ?? throw new BadHttpRequestException("invalid exts array");
        var tenantId = this.GetTenantId();
        return this.blobService.BatchSasToken(tenantId, exts);
    }

    [HttpPost("batchCommit")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    public async Task<IEnumerable<Sticker>> BatchCommit([FromBody] PostStickerBlobRequest[] reqs)
    {
        var tid = this.GetTenantId();
        var list = await this.blobService.BatchCommitBlocks(tid, reqs);
        var stickers = list.Where(s => !string.IsNullOrEmpty(s.src)).ToList();
        var result = await this.stickerService.addTenantStickers(tid, stickers, false);
        return result.Concat(list.Where(s => string.IsNullOrEmpty(s.src)));
    }

    [HttpPost("commit")]
    [Authorize(AuthenticationSchemes = "idtoken", Policy = "Admin")]
    [Obsolete("use batchCommit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var tenantId = this.GetTenantId();
        string src = await this.blobService.commitBlocks(tenantId, request);
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
