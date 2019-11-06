/**
 * 多语言支持
 */
import * as i18n from "i18n";

i18n.configure({
    // setup some locales - other locales default to en silently
    locales: ["en", "zh"],
    // you may alter a site wide default locale
    defaultLocale: "en",
    // where to store json files - defaults to './locales' relative to modules directory
    directory: "locale",
    extension: "/index.json",
    cookie: "lang",
    updateFiles: false,
});

export const i18nMiddleware = i18n.init;
