namespace Stickers.Models
{
    public class Page<T>
    {
        public List<T> values;

        public Page(List<T> list)
        {
            this.values = list;
        }
    }
}
