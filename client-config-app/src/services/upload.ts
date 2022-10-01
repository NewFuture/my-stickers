import Axios from "axios";
import { API } from "../lib/http";

const blob = Axios.create();
export interface SasInfo {
    id: string;
    // base64: string;
    token: string;
    url: string;
}

export interface UploadRequest {
    user?: string;
    token?: string;
    exts: string[];
}

export async function getUploadSAS(request: UploadRequest, url: string): Promise<SasInfo[]> {
    // TODO: You need to implement this
    // return "?newSAS";
    const result = await API.post(url, request);
    // const json = ;
    return result.data;
}

/**
 * Convert a Browser Blob object into ArrayBuffer.
 *
 * @export
 * @param {Blob} blob
 * @returns {Promise<ArrayBuffer>}
 */
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    const fileReader = new FileReader();
    return new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onloadend = (ev: any) => {
            resolve(ev.target!.result);
        };
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(blob);
    });
}

export async function upload(
    file: File,
    sas: SasInfo,
    url: "/admin/stickers/commit" | "/me/stickers/commit",
    onProgress: (p: { percent: number; p: number }) => void,
) {
    const contentType = file.type;
    await blob.put(`${sas.url}&comp=block&blockid=${btoa(sas.id)}`, await blobToArrayBuffer(file), {
        onUploadProgress: (p) => onProgress({ percent: 100 * (p.loaded / p.total), p: p }),
    });
    return await API.post(`${url}`, {
        id: sas.id,
        name: file.name,
        contentType,
    }).then(r => r.data);
}
