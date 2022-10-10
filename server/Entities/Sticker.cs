namespace Stickers.Entities;
public class Sticker
{
    public string? src { get; set; }
    public Guid id { get; set; }
    public string? name { get; set; }

    public long weight { get; set; }
}

