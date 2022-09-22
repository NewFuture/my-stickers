namespace Stickers.Models
{
    public struct Page<T>
    {
        public List<T> values;

        public Page(List<T> list)
        {
            this.values = list;
        }
    }
}
