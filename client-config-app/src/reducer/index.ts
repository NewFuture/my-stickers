import { combineReducers } from "redux";
import stickers, { StickerActionType, StickerAction } from "./stickers";
import status, { StatusActionType, StatusAction } from "./status";

import { ExitableAction, ExitableActionType, exitableReducer } from "./exitable";
// import { StickerStatus } from '../model/sticker';
// import { UploadableAction, UploadActionType, uploadableReducer } from './uploadable';

export type Action = ExitableAction | StickerAction | StatusAction;

type ActionType = ExitableActionType | StickerActionType | StatusActionType;
// eslint-disable-next-line @typescript-eslint/no-redeclare
const ActionType = {
    ...ExitableActionType,
    ...StickerActionType,
    ...StatusActionType,
};

export { ActionType };

export default combineReducers({
    exitable: exitableReducer,
    // uploadanle: uploadableReducer,
    stickers,
    status,
});
