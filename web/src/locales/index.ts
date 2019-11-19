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
    shortTitle = "common:shortTitle",
    description = "common:description",
    langSetting = "common:langSetting",
    not_found = "common:not_found",
    date = "common:date"
}

export enum HomePage {
    downloadExtension = "home:downloadExtension",
    tips = "home:tips",

    protoMsgExtTitle = "home:protoMsgExtTitle",
    protoMsgExtSubTitle = "home:protoMsgExtSubTitle",
    protoMsgExtStep1 = "home:protoMsgExtStep1",
    protoMsgExtStep2 = "home:protoMsgExtStep2",
    protoMsgExtStep3 = "home:protoMsgExtStep3",
    protoMsgExtStep4 = "home:protoMsgExtStep4",
    protoMsgExtTime = "home:protoMsgExtTime",
    protoMsgExtMenuMoreAction = "home:protoMsgExtMenuMoreAction",
    protoMsgExtMenuSaveStickers = "home:protoMsgExtMenuSaveStickers",
    protoMsgExtMenuSaveMsg = "home:protoMsgExtMenuSaveMsg",
    protoMsgExtMenuUnread = "home:protoMsgExtMenuUnread",
    protoMsgExtMenuTranslate = "home:protoMsgExtMenuTranslate",
    protoMsgExtStickerSavedTitle = "home:protoMsgExtStickerSavedTitle",

    protoComposeTitle = "home:protoComposeTitle",
    protoComposeSubTitle = "home:protoComposeSubTitle",
    protoComposeTime = "home:protoComposeTime",
    protoComposeIntro = "home:protoComposeIntro",
    protoComposeStep1 = "home:protoComposeStep1",
    protoComposeStep2 = "home:protoComposeStep2",
    protoComposeToday = "home:protoComposeToday",
}

export enum ConfigPage {
    upload = 'config:upload',
    delete = 'config:delete',
    loading = 'config:loading',
    maxsize = 'config:maxsize',
    maxnum = 'config:maxnum',
}
