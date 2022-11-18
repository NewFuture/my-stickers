namespace Stickers.Utils;

public static class IHeaderDictionaryExtension
{
    public const string SESSION_HEADER_KEY = "Session-Key";

    public static bool TryGetSessionId(this IHeaderDictionary headers, out Guid value)
    {
        if (headers.TryGetValue(SESSION_HEADER_KEY, out var sessionKey))
        {
            return Guid.TryParse(sessionKey, out value);
        }

        return Guid.TryParse(headers.AcceptLanguage.FirstOrDefault(), out value);
    }
}
