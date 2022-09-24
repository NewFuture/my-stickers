import { API } from "../lib/http";
import { getUploadSAS, upload } from "./upload";

export async function uploadSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const sasInfo = await getUploadSAS({
        exts: [file.name.split(".").pop()!],
    });
    return await upload(file, sasInfo[0], (p) => onProgressUpdate(p.percent));
}

export async function deleteSticker(id: string): Promise<string> {
    return await API.delete(`/me/stickers/${id}`);
}

export async function editSticker(id: string, name: string) {
    await API.patch(`/me/stickers/${id}`, { name });
}
