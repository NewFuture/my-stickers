// import * as zh from './zh';
// import * as en from './en';

// export { zh, en };
// export enum Messages {
//     title = "title",
//     description = "description",
//     not_found = "not_found",
//     home_downloadExtension = "home_downloadExtension",
//     upload = 'upload',
//     delete = 'delete',
// }

/**
 * 所有NameSapce
 */
export enum NS {
    common = "common",
    homePage = "home",
    configPage = "config"
}

// export function getLocale(): string {
//     return navigator.language || 'en';
// }

// export function getMessages() {
//     return getLocale().startsWith('zh') ? zh : en;
// }

export enum Common {
    title = "title",
    description = "description",
    not_found = "not_found",
}

export enum HomePage {
    downloadExtension = "downloadExtension",
}

export enum ConfigPage {
    upload = 'upload',
    delete = 'delete',
}