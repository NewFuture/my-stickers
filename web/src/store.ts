import reducer, { Action, ActionType } from "./reducer";
import { createStore } from "redux";
import { Status } from "./reducer/status";
import { Sticker, StickerStatus } from "./model/sticker";



export interface StateType {
    stickers: Sticker[],
    status: Status,
    exitable: boolean,
}

export const store = createStore<StateType, Action, {}, {}>(reducer);

function StatusHandler() {
    const state = store.getState();
    const stickers = state.stickers;
    const stopStatus = [StickerStatus.success, StickerStatus.edit_fail, StickerStatus.delete_fail, StickerStatus.upload_fail];
    const ready = !stickers.find(s => s.status && !stopStatus.includes(s.status))
    if (ready) {
        if (state.status === Status.syncing) {
            store.dispatch({ type: ActionType.Status_Ready })
        }
    } else if (state.status !== Status.syncing) {
        store.dispatch({ type: ActionType.Status_Syncing })
    }
}
store.subscribe(StatusHandler);