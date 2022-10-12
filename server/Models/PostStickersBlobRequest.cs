namespace Stickers.Models;

public class PostStickerBlobRequest
{
    public Guid id { get; set; }
    public string? name { get; set; }
    public string? contentType { get; set; }
}
