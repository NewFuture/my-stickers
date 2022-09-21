import { API } from "../lib/http";
import { getUploadSAS, upload } from "./upload";
import useSWR from "swr";
import axios from "axios";
import { auth } from "./teams";

const fetcher = (url: string) =>
    axios
        .get(`${process.env.REACT_APP_API_ROOT}${url}` || `/api/${url}`, {
            headers: { Authorization: `${auth.id} ${auth.token}` },
        })
        .then((res) => res.data);

export function useStickersList(isTenant: boolean) {
    const url = isTenant ? "tenant/stickers" : "me/stickers";
    const { data, error } = useSWR("stickers", () => fetcher(url));
    return {
        stickers: data?.values,
        isLoading: !error && !data,
        isError: error,
    };
}

export async function uploadSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const sasInfo = await getUploadSAS({
        exts: [file.name.split(".").pop()!],
    });
    return await upload(file, sasInfo[0], (p) => onProgressUpdate(p.percent));
}

export async function deleteSticker(id: string): Promise<string> {
    return await API.delete(`/stickers/${id}`);
}

export async function editSticker(id: string, name: string) {
    await API.patch(`/stickers/${id}`, { name });
}
