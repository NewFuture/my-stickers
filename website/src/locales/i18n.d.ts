import en from "./en.json";
declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "translation";
        resources: {
            translation: typeof en;
        };
    }
}
