using Microsoft.AspNetCore.Mvc;
using Stickers.Entities;
using Stickers.Service;

namespace Stickers.Controllers;

[ApiController]
[Route("[controller]")]
public class StickersController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<StickersController> _logger;
    private StickerStorage stickerStorage = null;

    public StickersController(StickerStorage stickerStorage, ILogger<StickersController> logger)
    {
        this.stickerStorage = stickerStorage;
        _logger = logger;
    }

    [HttpPost(Name = "/stickers/commit")]
    public IEnumerable<string>? Commit()
    {
        return null;
    }
    [HttpGet(Name = "me/stickers")]
    public async Task<List<Sticker>> Get(string userId)
    {
        return await this.stickerStorage.getUserStickers(userId);
    }
    [HttpDelete(Name = "/stickers")]
    public async Task<bool> Delete(string id, string userId)
    {
        return await this.stickerStorage.deleteUserSticker(userId, id);
    }
    [HttpPatch(Name = "/stickers")]
    public async Task<bool> UpdateSticker(string id,string userId,string name)
    {
        return await this.stickerStorage.updateStickerName(userId, id, name);
    }

}
