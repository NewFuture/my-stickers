using Microsoft.AspNetCore.Mvc;

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

    public StickersController(ILogger<StickersController> logger)
    {
        _logger = logger;
    }

    [HttpPost(Name = "/stickers/commit")]
    public IEnumerable<string>? Commit()
    {
        return null;
    }
    [HttpGet(Name = "me/stickers")]
    public IEnumerable<string>? Get()
    {
        return null;
    }
    [HttpDelete(Name = "/stickers")]
    public IEnumerable<string>? Delete(string id)
    {
        return null;
    }
    [HttpPatch(Name = "/stickers")]
    public IEnumerable<string>? UpdateSticker(string id)
    {
        return null;
    }

}
