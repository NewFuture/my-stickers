namespace Stickers.Models;

public record struct PostStickerBlobRequest
{
    public Guid id;
    public string? name;
    public string? contentType;
    public long weight;
}
