namespace Stickers.Service
{
    public class SesssionService
    {
        private readonly IMemoryCache _cache;
        public SesssionService(IMemoryCache configuration)
        {
            _cache = configuration;
        }

        public Guid GetSessionInfo(string key)
        {
            return Guid.NewGuid();
        }

        public Guid GenerateSession(Guid userId)
        {
            var key = Guid.NewGuid();
            this._cache.
            return key;
        }

    }
}
