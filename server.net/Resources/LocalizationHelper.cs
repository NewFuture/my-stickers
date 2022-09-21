// <copyright file="LocalizationHelper.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Stickers.Resources
{
    using Microsoft.AspNetCore.Localization;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Globalization;
    using System.Linq;

    /// <summary>
    /// Utility class for localization related methods.
    /// </summary>
    public class LocalizationHelper
    {
        /// <summary>
        /// Default culture to use if the request culture could not be determined.
        /// </summary>
        public static readonly RequestCulture DefaultRequestCulture = new RequestCulture(DefaultCultureString, DefaultCultureString);

        /// <summary>
        /// String representation of the default culture.
        /// </summary>
        private const string DefaultCultureString = "en-US";

        /// <summary>
        /// List of cultures that are currently supported.
        /// </summary>
        private static readonly Lazy<IList<CultureInfo>> SupportedCulturesList = new Lazy<IList<CultureInfo>>(LoadSupportedCultures);

        /// <summary>
        /// Gets the list of cultures for which localization is supported.
        /// Support for a culture is determined by existence of a resource file for that culture.
        /// </summary>
        public static IList<CultureInfo> SupportedCultures => SupportedCulturesList.Value;

        /// <summary>
        /// Looks up localized version of the string based on the key, using the current culture.
        /// </summary>
        /// <param name="key">Key used to look up string.</param>
        /// <param name="culture">string culture</param>
        /// <returns>Localized string.</returns>
        public static string LookupString(string key, CultureInfo culture)
        {
            var str = StickerStrings.ResourceManager.GetString(key, culture) ?? key;
            return str;
        }

        /// <summary>
        /// Looks at localized resource files and returns a list of corresponding cultures.
        /// </summary>
        /// <returns>List of <see cref="CultureInfo"/> that are supported.</returns>
        private static IList<CultureInfo> LoadSupportedCultures()
        {
            var resourceManager = StickerStrings.ResourceManager;
            var allCultures = CultureInfo.GetCultures(CultureTypes.AllCultures);

            var supportedCultures = new HashSet<CultureInfo>
            {
                new CultureInfo(DefaultCultureString),
            };

            foreach (var culture in allCultures)
            {
                try
                {
                    if (culture.Equals(CultureInfo.InvariantCulture))
                    {
                        continue;
                    }

                    if (resourceManager.GetResourceSet(culture, true, false) != null)
                    {
                        supportedCultures.Add(culture);
                    }
                }
                catch (CultureNotFoundException e)
                {
                    Trace.TraceWarning($"Attempted to load invalid culture: {e}");
                }
            }

            return supportedCultures.ToList();
        }
    }
}