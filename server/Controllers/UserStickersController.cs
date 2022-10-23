namespace Stickers.Controllers;

using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Models;
using Stickers.Service;
using Stickers.Utils;

[ApiController]
[Route("api/me/stickers")]
public class UserStickersController : ControllerBase
{
    private readonly SessionService sessionService;
    protected readonly ILogger<UserStickersController> logger;
    private readonly StickerService stickerService;
    private readonly BlobService blobService;
    private readonly IHttpContextAccessor httpContextAccessor;

    public UserStickersController(
        StickerService stickers,
        BlobService blobService,
        ILogger<UserStickersController> logger,
        IHttpContextAccessor httpContextAccessor,
        SessionService sessionService
    )
    {
        this.stickerService = stickers;
        this.blobService = blobService;
        this.httpContextAccessor = httpContextAccessor;
        this.logger = logger;
        this.sessionService = sessionService;
    }

    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var userId = this.GetUserId();
        string? extendName = Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(
            userId,
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
        var list = await this.stickerService.addUserStickers(
            userId,
            new List<Sticker>() { newSticker },
            false
        );
        return list[0];
    }

    [HttpGet("/api/me/stickers")]
    public async Task<Page<Sticker>> Get()
    {
        var userId = this.GetUserId();
        var stickers = await this.stickerService.getUserStickers(userId);
        return new Page<Sticker>(stickers);
    }

    [HttpDelete("{id}")]
    public async Task<Result> Delete(string id)
    {
        var userId = this.GetUserId();
        var result = await this.stickerService.deleteUserSticker(userId, id);
        return new Result(result);
    }

    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, [FromBody] PatchStickerRequest request)
    {
        var userId = this.GetUserId();
        var result = await this.stickerService.updateUserSticker(userId, id, request);
        return new Result(result);
    }

    [HttpPost("upload")]
    public IEnumerable<SasInfo> Upload([FromBody] UploadRequest request)
    {
        var list = new List<SasInfo>();
        foreach (var item in request.exts!)
        {
            var token = this.blobService.getSasToken(this.GetUserId(), item);
            list.Add(token);
        }
        return list;
    }

    protected Guid GetUserId()
    {
        this.Request.Headers.TryGetValue(ENV.SESSION_HEADER_KEY, out var headerValue);
        if (!string.IsNullOrEmpty(headerValue))
        {
            Guid.TryParse(headerValue, out var sessionKey);
            var sessionInfo = this.sessionService.GetSessionInfo(sessionKey);
            if (sessionInfo == Guid.Empty)
            {
                this.logger.LogWarning("Invalid SessionKey" + headerValue);
                throw new UnauthorizedAccessException("invalidate session");
            }
            return sessionInfo;
        }
        this.logger.LogWarning("Empty Session Key");
        throw new UnauthorizedAccessException("SessionKey required");
    }
}
