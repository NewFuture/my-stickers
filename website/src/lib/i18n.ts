import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import TimeAgo from 'javascript-time-ago';
import enTime from 'javascript-time-ago/locale/en'
import zhTime from 'javascript-time-ago/locale/zh';
import zhCN from "../locales/zh-cn.json";
import en from "../locales/en.json";

TimeAgo.addLocale(enTime);
TimeAgo.addLocale(zhTime);

i18n
    // load translation using xhr -> see /public/locales
    // learn more: https://github.com/i18next/i18next-xhr-backend
    //   .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
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
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
            format: (value, format, lng) => {
                if (format === "time-ago") {
                    return new TimeAgo(lng!).format(value)
                }
                return value;
            }
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
