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



// eslint-disable-next-line @typescript-eslint/no-namespace
// namespace Locales {
/**
* 所有NameSapce
*/
export enum NS {
    common = "common",
    homePage = "home",
    configPage = "config"
}

export enum Common {
    title = "common:title",
    description = "common:description",
    not_found = "common:not_found",
}

export enum HomePage {
    downloadExtension = "home:downloadExtension",
}

export enum ConfigPage {
    upload = 'config:upload',
    delete = 'config:delete',
}
