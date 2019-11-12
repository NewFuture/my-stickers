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
    langSetting = "common:langSetting",
    not_found = "common:not_found",
}

export enum HomePage {
    downloadExtension = "home:downloadExtension",
    protoMsgExtTitle = "home:protoMsgExtTitle",
    protoMsgExtSubTitle = "home:protoMsgExtSubTitle",
    protoMsgExtStep1 = "home:protoMsgExtStep1",
    protoMsgExtStep2 = "home:protoMsgExtStep2",
    protoMsgExtStep3 = "home:protoMsgExtStep3",
    protoMsgExtStep4 = "home:protoMsgExtStep4",
    protoMsgExtTime = "home:protoMsgExtTime",
    protoMsgExtMenuMoreAction = "home:protoMsgExtMenuMoreAction",
    protoMsgExtMenuSaveStickers = "home:protoMsgExtMenuSaveStickers",


}

export enum ConfigPage {
    upload = 'config:upload',
    delete = 'config:delete',
}
