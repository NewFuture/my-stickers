namespace Stickers.Models;

public record struct PatchStickerRequest
{
    public string? name { get; set; }
    public int? weight { get; set; }
}
