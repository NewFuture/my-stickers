namespace Stickers.Models
{
    public class OfficialSticker
    {
        public string img { get; set; }
        public string Name { get; set; }
        public List<string> keywords { get; set; }
        public Dictionary<string, string> localName { get; set; }
    }
}
