using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Stickers.Models;
using Stickers.Resources;

namespace Stickers.Search
{
    public class OfficialStickersSearchHandler
    {
        private readonly Lazy<List<OfficialSticker>> data = new Lazy<List<OfficialSticker>>(() =>
        {
            HttpClient client = new HttpClient();
            HttpResponseMessage response = client.GetAsync("https://stickerstestblob.z7.web.core.windows.net/official-stickers/index.json").Result;
            response.EnsureSuccessStatusCode();
            string responseBody = response.Content.ReadAsStringAsync().Result;
            var jObject = JsonConvert.DeserializeObject(responseBody) as JObject;
            return jObject["stickers"].ToObject<List<OfficialSticker>>();
        }, LazyThreadSafetyMode.PublicationOnly);

        public List<OfficialSticker> GetAllOfficialStickers()
        {
            return data.Value;
        }

        public List<OfficialSticker> Search(string keyword)
        {
            var lowerKeyword = keyword.ToLower();
            var result = new List<OfficialSticker>();

            if (string.IsNullOrWhiteSpace(keyword))
            {
                return result;
            }

            foreach (var sticker in data.Value)
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
