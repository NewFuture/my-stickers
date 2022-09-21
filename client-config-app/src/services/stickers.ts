import { API } from "../lib/http";
import { getUploadSAS, upload } from "./upload";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) =>
    axios
        //   .get(`${process.env.REACT_APP_API_ROOT}${url}` || `/api/${url}`, { headers: { Authorization: `${auth.id} ${auth.token}` } })
        .get(`${process.env.REACT_APP_API_ROOT}${url}` || `/api/${url}`, {
            headers: {
                Authorization:
                    "b614c4c4-2d74-4e56-bc0d-cc0d79b2715f 1663756411131.u8TlauIHpr2mdT9KyrEjZiJxtd5ftEN6TIxCtkVAC3c",
            },
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
