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
    private readonly SessionService sessionService;

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
        this.sessionService = sessionService;
    }

    [HttpGet]
    public async Task<Page<Sticker>> Get()
    {
        var stickers = await this.stickerService.getUserStickers(this.GetUserId());
        return new Page<Sticker>(stickers);
    }

    [HttpDelete("{id}")]
    public async Task<Result> Delete(Guid id, [FromBody] DeleteStickerBody request)
    {
        var uid = this.GetUserId();
        var result = await this.stickerService.deleteUserSticker(this.GetUserId(), id.ToString());
        if (result & !string.IsNullOrWhiteSpace(request.src))
        {
            result = await this.blobService.Delete(uid, id, request.src!);
        }
        return new Result(result);
    }

    [HttpPatch("{id}")]
    public async Task<Result> UpdateSticker(string id, [FromBody] PatchStickerRequest request)
    {
        var result = await this.stickerService.updateUserSticker(this.GetUserId(), id, request);
        return new Result(result);
    }

    [HttpPost("upload")]
    public IEnumerable<SasInfo> Upload([FromBody] UploadRequest request)
    {
        var exts = request?.exts ?? throw new BadHttpRequestException("invalid exts array");
        var userId = this.GetUserId();
        return this.blobService.BatchSasToken(userId, exts);
    }

    [HttpPost("batchCommit")]
    public async Task<IEnumerable<Sticker>> BatchCommit([FromBody] PostStickerBlobRequest[] reqs)
    {
        var userId = this.GetUserId();
        var list = await this.blobService.BatchCommitBlocks(userId, reqs);
        var stickers = list.Where(s => !string.IsNullOrEmpty(s.src)).ToList();
        var result = await this.stickerService.addUserStickers(userId, stickers, false);
        return result.Concat(list.Where(s => string.IsNullOrEmpty(s.src)));
    }

    [HttpPost("commit")]
    [Obsolete("use batchCommit")]
    public async Task<Sticker> Commit([FromBody] PostStickerBlobRequest request)
    {
        var userId = this.GetUserId();
        string src = await this.blobService.commitBlocks(userId, request);
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

    private Guid GetUserId()
    {
        if (this.Request.Headers.TryGetSessionId(out var sessionId))
        {
            if (this.sessionService.TryGetSessionInfo(sessionId, out var userId))
            {
                return userId;
            }
            this.logger.LogWarning("Invalid sessionInfo: {headerValue}", sessionId);
            throw new UnauthorizedAccessException("invalidate session");
        }
        this.logger.LogWarning("Empty SessionKey");
        throw new UnauthorizedAccessException("SessionKey required");
    }
}
