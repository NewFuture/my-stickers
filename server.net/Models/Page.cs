namespace Stickers.Models
{
    public class Page<T>
    {
        public List<T> Values { get; set; }

        public Page(List<T> list)
        {
            this.Values = list;
        }
    }
}
