/// <reference types="react-scripts" />

import en from "./locales/en.json";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "translation";
        resources: {
            translation: typeof en;
        };
    }
}

declare global {
    interface File {
        weight?: number;
    }
}
