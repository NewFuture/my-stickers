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

    [HttpGet(Name = "me/stickers")]
    public IEnumerable<string>? Get()
    {
        return null;
    }
}
