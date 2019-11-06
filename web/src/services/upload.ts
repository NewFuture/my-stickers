import Axios from "axios";
import { API } from "../lib/http";

const blob = Axios.create();
export interface SasInfo {
    id: string;
    base64: string;
    token: string;
    url: string;
}

export interface UploadRequest {
    // user: string,
    // token: string,
    exts: string[],
}

export async function getUploadSAS(request: UploadRequest): Promise<SasInfo[]> {
    // TODO: You need to implement this
    // return "?newSAS";
    const result = await API.post('/api/upload', request)
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

export async function upload(file: File, sas: SasInfo) {
    const contentType = file.type;
    await blob.put(`${sas.url}&comp=block&blockid=${sas.base64}`, await blobToArrayBuffer(file))
    await blob.put(`${sas.url}&comp=blocklist`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><BlockList><Latest>${sas.base64}</Latest></BlockList>`, {
        headers: {
            "x-ms-blob-content-type": contentType
        }
    })
    return await API.post("/api/me/stickers", {
        sticker: {
            id: sas.id,
            src: sas.url.split('?').shift(),
            name: file.name.replace(/\..*$/, ""),
        }
    })
}