import reducer, { Action } from "./reducer";
import { createStore } from "redux";
import { Status } from "./reducer/status";
import { Sticker } from "./model/sticker";



export interface StateType {
    stickers: Sticker[],
    status: Status,
    exitable: boolean,
}

export const store = createStore<StateType, Action, {}, {}>(reducer);