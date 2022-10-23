namespace Stickers.Resources
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Resources;

    /// <summary>
    /// Utility class for localization related methods.
    /// </summary>
    public class LocalizationHelper
    {
        /// <summary>
        /// String representation of the default culture.
        /// </summary>
        private const string DefaultCultureString = "en-US";

        /// <summary>
        /// Default culture to use if the request culture could not be determined.
        /// </summary>
        public static readonly CultureInfo DefaultCulture = new CultureInfo(
            DefaultCultureString,
            false
        );

        private static readonly Dictionary<string, ResourceSet> LngMap =
            new Dictionary<string, ResourceSet>();

        /// <summary>
        /// Looks up localized version of the string based on the key, using the current culture.
        /// </summary>
        /// <param name="key">Key used to look up string.</param>
        /// <param name="culture">string culture</param>
        /// <returns>Localized string.</returns>
        public static string LookupString(string key, string locale)
        {
            var str = GetResourceByLocale(locale).GetString(key) ?? key;
            return str;
        }

        private static ResourceSet GetResourceByLocale(string locale)
        {
            if (LngMap.TryGetValue(locale, out var resourceSet))
            {
                return resourceSet;
            }

            var culture = new CultureInfo(locale, false);
            resourceSet = StickerStrings.ResourceManager.GetResourceSet(culture, true, true);
            LngMap.Add(locale, resourceSet!);
            return resourceSet!;
        }
    }
}
