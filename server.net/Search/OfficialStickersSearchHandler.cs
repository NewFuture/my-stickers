using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stickers.Models;
using Stickers.Resources;

namespace Stickers.Search
{
    public class OfficialStickersSearchHandler
    {
        private static readonly List<OfficialSticker> data;

        static OfficialStickersSearchHandler()
        {
            var officialStickersJson = File.ReadAllText(Path.Combine("Statics", "index.json"));
            var jObject = JsonConvert.DeserializeObject(officialStickersJson) as JObject;
            data = jObject["stickers"].ToObject<List<OfficialSticker>>();
        }

        public List<OfficialSticker> Search(string keyword)
        {
            var lowerKeyword = keyword.ToLower();
            var result = new List<OfficialSticker>();

            if (string.IsNullOrWhiteSpace(keyword))
            {
                return result;
            }

            foreach (var sticker in data)
            {
                if(sticker.keywords.Any(t => t.ToLower().Contains(lowerKeyword)))
                {
                    result.Add(sticker);
                }
            }

            return result;
        }
    }
}
