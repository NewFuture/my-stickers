namespace Stickers.Entities;

public record OfficialSticker
{
    public string? img { get; set; }
    public string? name { get; set; }
    public string? type { get; set; }

    public List<string>? keywords { get; set; }
    public Dictionary<string, string>? localName { get; set; }
    public string? url { get; set; }
    public string? collection { get; set; }
}

public class OfficialStickerList
{
    public List<OfficialSticker>? stickers;
}
