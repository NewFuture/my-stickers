using Microsoft.AspNetCore.Mvc;

namespace Stickers.Controllers;

[ApiController]
[Route("[controller]")]
public class UploadController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<StickersController> _logger;

    public UploadController(ILogger<StickersController> logger)
    {
        _logger = logger;
    }


    [HttpPost(Name = "upload")]
    public bool Upload()
    {
        return true;
    }
}
