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
    protected readonly ILogger<UserStickersController> logger;
    private readonly StickerService stickerService;
    private readonly BlobService blobService;
    private readonly Guid userId;

    public UserStickersController(
        StickerService stickers,
        BlobService blobService,
        ILogger<UserStickersController> logger,
        SessionService sessionService
    )
    {
        this.stickerService = stickers;
        this.blobService = blobService;
        this.logger = logger;
        this.userId = this.GetUserId(sessionService);
    }

    [HttpPost("commit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        string? extendName = Path.GetExtension(request.name);
        string src = await this.blobService.commitBlocks(
            this.userId,
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
            this.userId,
            new List<Sticker>() { newSticker },
            false
        );
        return list[0];
    }

    [HttpGet("/api/me/stickers")]
    public async Task<Page<Sticker>> Get()
    {
        var stickers = await this.stickerService.getUserStickers(this.userId);
        return new Page<Sticker>(stickers);
    }

    [HttpDelete("{id}")]
    public async Task<Result> Delete(string id)
    {
        var result = await this.stickerService.deleteUserSticker(this.userId, id);
        return new Result(result);
    }

    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, [FromBody] PatchStickerRequest request)
    {
        var result = await this.stickerService.updateUserSticker(this.userId, id, request);
        return new Result(result);
    }

    [HttpPost("upload")]
    public IEnumerable<SasInfo> Upload([FromBody] UploadRequest request)
    {
        var list = new List<SasInfo>();
        foreach (var item in request.exts!)
        {
            var token = this.blobService.getSasToken(this.userId, item);
            list.Add(token);
        }
        return list;
    }

    protected Guid GetUserId(SessionService sessionService)
    {
        this.Request.Headers.TryGetValue(ENV.SESSION_HEADER_KEY, out var headerValue);
        if (!string.IsNullOrEmpty(headerValue) && Guid.TryParse(headerValue, out var sessionKey))
        {
            var sessionInfo = sessionService.GetSessionInfo(sessionKey);
            if (sessionInfo == Guid.Empty)
            {
                this.logger.LogWarning("Invalid sessionInfo: {headerValue}", headerValue);
                throw new UnauthorizedAccessException("invalidate session");
            }
            return sessionInfo;
        }
        this.logger.LogWarning("Empty or None-GUID SessionKey: {headerValue}", headerValue);
        throw new UnauthorizedAccessException("SessionKey required");
    }
}
