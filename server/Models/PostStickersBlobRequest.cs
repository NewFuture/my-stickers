namespace Stickers.Models;

public record struct PostStickerBlobRequest
{
    public Guid id { get; set; }
    public string? name { get; set; }
    public string? contentType { get; set; }
    public long weight { get; set; }
}
