import * as i18n from "i18n";
import * as debug from "debug";

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
    // setting of log level WARN - default to require('debug')('i18n:warn')
    logWarnFn: debug("i18n:warn"),
    // setting of log level ERROR - default to require('debug')('i18n:error')
    logErrorFn: debug("i18n:error"),

});

export const i18nMiddleware = i18n.init;