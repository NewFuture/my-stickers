import { API } from "../lib/http";
import { Sticker } from "../model/sticker";
import { store } from "../store";
import { ActionType, } from "../reducer/";
import { getUploadSAS, upload, SasInfo } from "./upload";
// import { ActionType } from "../reducer/action";
// export interface Sticker {
//     src: string;
//     id: string | number;
//     name?: string;
// }

export async function getStickers(): Promise<void> {
    store.dispatch({ type: ActionType.Status_Pending });
    try {
        const result = await API.get<{ values: Sticker[] }>("/me/stickers");
        store.dispatch({ type: ActionType.Status_Ready });
        store.dispatch({ type: ActionType.STICKER_fetch, payload: result.data.values });
    } catch (error) {

    }
}

async function uploadSticker(file: File, sas: SasInfo) {
    // store.dispatch
    const result = await upload(file, sas);
    store.dispatch({
        type: ActionType.STICKER_uploadSuccess,
        payload: {
            id: sas.id,
            src: result.data.src,
        }
    })
}

export async function uploadStickers(files: File[]) {
    // files = files.filter((f, i) => i < max);
    const stickers: Sticker[] = files.map((f, i) => ({ id: `${i}.${Math.random()}`, src: URL.createObjectURL(f), name: f.name.replace(/\..*$/, "") }));
    store.dispatch({
        type: ActionType.STICKER_preupload,
        payload: stickers,
    })

    const sasInfos = await getUploadSAS({
        exts: files.map(f => f.name.split(".").pop()!),
    });
    store.dispatch({
        type: ActionType.STICKER_upload,
        payload: sasInfos.map((sas, i) => ({
            id: stickers[i].id,
            new_id: sas.id
        }))
    })

    sasInfos.forEach((sas, i) => uploadSticker(files[i], sas))
}