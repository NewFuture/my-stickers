namespace Stickers.Utils;

public static class IHeaderDictionaryExtension
{
    // user Content-Language to make the simple_requests avoid Preflight request
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
    public const string SESSION_HEADER_KEY = "Content-Language";

    public const string FALLBACK_SESSION_HEADER_KEY = "Session-Key";

    public static bool TryGetSessionId(this IHeaderDictionary headers, out Guid value)
    {
        if (
            headers.TryGetValue(SESSION_HEADER_KEY, out var sessionKey)
            && Guid.TryParse(sessionKey, out value)
        )
        {
            return true;
        }

        value = default;
        return headers.TryGetValue(FALLBACK_SESSION_HEADER_KEY, out sessionKey)
            && Guid.TryParse(sessionKey, out value);
    }
}
