import { API } from "./http";
import type { Sticker } from "../model/sticker";
import { getUploadSAS, upload } from "./upload";

export async function uploadSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const sasInfo = await getUploadSAS(
        {
            exts: [file.name.split(".").pop()!],
        },
        "/me/stickers/upload",
    );
    return await upload(file, sasInfo[0], "/me/stickers/commit", (p) => onProgressUpdate(p.percent));
}

export async function uploadTenantSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const sasInfo = await getUploadSAS(
        {
            exts: [file.name.split(".").pop()!],
        },
        "/admin/stickers/upload",
    );
    return await upload(file, sasInfo[0], "/admin/stickers/commit", (p) => onProgressUpdate(p.percent));
}

export async function deleteSticker(id: string): Promise<string> {
    return await API.delete(`/me/stickers/${id}`);
}

export async function patchSticker(id: string, data: Partial<Sticker>) {
    await API.patch(`/me/stickers/${id}`, data);
}

export async function deleteTenantSticker(id: string): Promise<string> {
    return await API.delete(`/admin/stickers/${id}`);
}

export async function patchTenantSticker(id: string, data: Partial<Sticker>) {
    await API.patch(`/admin/stickers/${id}`, data);
}
