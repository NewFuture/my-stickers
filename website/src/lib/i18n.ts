import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import enTime from "javascript-time-ago/locale/en";
import zhTime from "javascript-time-ago/locale/zh";
import zhHantTime from "javascript-time-ago/locale/zh-Hant";
import esTime from "javascript-time-ago/locale/es";
import ptTime from "javascript-time-ago/locale/pt";
import jaTime from "javascript-time-ago/locale/ja";
import koTime from "javascript-time-ago/locale/ko";
import zhCN from "../locales/zh-cn.json";
import zhTW from "../locales/zh-tw.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import pt from "../locales/pt.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";

TimeAgo.addLocale(enTime);
TimeAgo.addLocale(zhTime);
TimeAgo.addLocale(zhHantTime);
TimeAgo.addLocale(esTime);
TimeAgo.addLocale(ptTime);
TimeAgo.addLocale(jaTime);
TimeAgo.addLocale(koTime);

i18n
    // load translation using xhr -> see /public/locales
    // learn more: https://github.com/i18next/i18next-xhr-backend
    //   .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: "en",
        lowerCaseLng: true,
        debug: process.env.NODE_ENV === "development",
        resources: {
            en: { translation: en },
            "zh-cn": { translation: zhCN },
            "zh-tw": { translation: zhTW },
            es: { translation: es },
            pt: { translation: pt },
            ja: { translation: ja },
            ko: { translation: ko },
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
            format: (value, format, lng) => {
                if (format === "time-ago") {
                    // Map zh-tw to zh-Hant for TimeAgo
                    const timeAgoLocale = lng === "zh-tw" ? "zh-Hant" : lng;
                    return new TimeAgo(timeAgoLocale!).format(value);
                }
                return value;
            },
        },
        // react i18next special options (optional)
        // override if needed - omit if ok with defaults
        /*
        react: {
          bindI18n: 'languageChanged',
          bindI18nStore: '',
          transEmptyNodeValue: '',
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
          useSuspense: true,
        }
        */
    });

export default i18n;
const StorageKey = "i18nextLng";

i18n.on("languageChanged", (lng: string): void => {
    document.documentElement.setAttribute("lang", lng);
    localStorage.setItem(StorageKey, lng);
});

export function getLng() {
    const query = new URLSearchParams(window.location.search);
    return query.get("lng") || localStorage.getItem(StorageKey) || navigator.language || navigator.languages?.[0];
}
