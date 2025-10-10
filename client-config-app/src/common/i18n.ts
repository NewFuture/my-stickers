import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { INIT_QUERY } from "./env";
import zhCN from "../locales/zh-cn.json";
import zhTW from "../locales/zh-tw.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import pt from "../locales/pt.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";

const lng = INIT_QUERY.get("lng") || navigator.language || navigator.languages?.[0];

i18n
    // load translation using xhr -> see /public/locales
    // learn more: https://github.com/i18next/i18next-xhr-backend
    //   .use(Backend)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: process.env.NODE_ENV === "development",
        lng,
        fallbackLng: "en",
        lowerCaseLng: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: { translation: en },
            "zh-cn": { translation: zhCN },
            "zh-tw": { translation: zhTW },
            es: { translation: es },
            pt: { translation: pt },
            ja: { translation: ja },
            ko: { translation: ko },
        },
    });

i18n.on("languageChanged", (lng: string): void => {
    document.documentElement.setAttribute("lang", lng);
});
export default i18n;
