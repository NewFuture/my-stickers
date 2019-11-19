import { Sticker, StickerStatus } from "../model/sticker";

// import { Sticker } from "./stickers";

export enum StickerActionType {
    STICKER_fetch = "STICKER_FETCH",
    STICKER_preupload = "STICKER_ADD",
    STICKER_upload = "STICKER_upload",
    STICKER_uploading = "STICKER_UPLOADING",
    STICKER_uploadSuccess = "STICKER_UPLOAD_SUCCESS",
    STICKER_uploadFail = "STICKER_UPLOAD_FAIL",

    STICKER_delete = "STICKER_DELETE",
    STICKER_deleteSuccess = "STICKER_DELETE_SUCCESS",
    STICKER_deleteFail = "STICKER_DELETE_FAIL",

    STICKER_edit = "Sticker_edit",
    STICKER_editSuccess = "Sticker_editSuccess",
    STICKER_editFail = "STICKER_editFail",

    STICKER_move = "STICKER_move",
    STICKER_moveSuccess = "STICKER_moveSuccess",
    STICKER_moveFail = "STICKER_moveFail",

}

export type StickerAction =
    {
        type: StickerActionType.STICKER_fetch,
        payload: Sticker[],
    } | {
        type: StickerActionType.STICKER_preupload,
        payload: { id: string, src: string, name?: string }[]
    } | {
        type: StickerActionType.STICKER_upload,
        payload: {
            id: string,
            new_id: string,
        }[]
    } | {
        type: StickerActionType.STICKER_uploading
        payload: {
            id: string,
            progress: number,
        }
    } | {
        type: StickerActionType.STICKER_uploadSuccess
        payload: {
            id: string,
            src: string,
        }
    } | {
        type: StickerActionType.STICKER_uploadFail
        payload: {
            id: string,
        }
    } | {
        type: StickerActionType.STICKER_delete,
        payload: {
            id: string
        }
    } | {
        type: StickerActionType.STICKER_deleteSuccess,
        payload: {
            id: string
        }
    } | {
        type: StickerActionType.STICKER_deleteFail,
        payload: {
            id: string
        }
    } | {
        type: StickerActionType.STICKER_edit,
        payload: {
            id: string
            name: string
        }
    } | {
        type: StickerActionType.STICKER_editFail,
        payload: {
            id: string
        }
    } | {
        type: StickerActionType.STICKER_editSuccess,
        payload: {
            id: string
        }
    } | {
        type: StickerActionType.STICKER_move,
        payload: {
            from: string
            to: string
        }
    } | {
        type: StickerActionType.STICKER_moveSuccess,
        payload: {
            from: string
            to: string
        }
    } | {
        type: StickerActionType.STICKER_moveFail,
        payload: {
            from: string
            to: string
        }
    }


function stickers(state: Sticker[] = [], action: StickerAction): Sticker[] {
    // const payload = action.payload;
    switch (action.type) {
        case StickerActionType.STICKER_fetch:
            // 加载完表情
            return action.payload;

        case StickerActionType.STICKER_preupload:
            // 准备上传
            const newState: Sticker[] = action.payload.map(s => ({ ...s, status: StickerStatus.upload, progress: 0 }));
            newState.push(...state)
            return newState;
        case StickerActionType.STICKER_upload:
            // 开始上传
            const ids = action.payload.map(s => s.id);
            return state.map(s => (ids.includes(s.id)) ? { ...s, id: action.payload.find(data => data.id === s.id)!.new_id, status: StickerStatus.uploading, progress: 10 } : s);
        case StickerActionType.STICKER_uploading:
            // 更新上传进度
            return state.map(s => s.id === action.payload.id ? { ...s, progress: 9 + Math.round(0.9 * action.payload.progress) } : s);
        case StickerActionType.STICKER_uploadSuccess:
            // 上传完成
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.success, progress: 100 } : s);
        case StickerActionType.STICKER_uploadFail:
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.upload_fail, progress: 0 } : s);

        case StickerActionType.STICKER_edit:
            // 开始更新数据
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.editing, progress: undefined } : s);
        case StickerActionType.STICKER_editSuccess:
            // 更新失败
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.success } : s);
        case StickerActionType.STICKER_editFail:
            // 更新完成
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.edit_fail } : s);

        case StickerActionType.STICKER_delete:
            // 开始删除
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.delete, progress: undefined } : s);
        case StickerActionType.STICKER_deleteFail:
            // 删除失败
            return state.map(s => s.id === action.payload.id ? { ...s, status: StickerStatus.delete_fail } : s);
        case StickerActionType.STICKER_deleteSuccess:
            // 删除完成
            return state.filter(s => s.id !== action.payload.id);

        // return state.map(todo =>
        //     (stickers.id === action.id)
        //         ? { ...todo, completed: !todo.completed }
        //         : todo
        // )
        default:
            return state
    }
}

export default stickers