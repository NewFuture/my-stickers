import reducer, { Action, ActionType } from "./reducer";
import { createStore } from "redux";
import { Status } from "./reducer/status";
import { Sticker, StickerStatus } from "./model/sticker";



export interface StateType {
    stickers: Sticker[],
    status: Status,
    exitable: boolean,
}


/**
 * for react-snap
 */
// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;
// Tell react-snap how to save Redux state
window.snapSaveState = () => ({
    __PRELOADED_STATE__: store.getState()
});


export const store = createStore<StateType, Action, {}, {}>(reducer, preloadedState);

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

