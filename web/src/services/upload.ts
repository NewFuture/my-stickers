import { getUserId } from "./teams";

export interface SasInfo {
    id: string;
    base64: string;
    token: string;
    url: string;
}

export interface UploadRequest {
    user: string,
    token: string,
    exts: string[],
}

export async function getUploadSAS(request: UploadRequest): Promise<SasInfo[]> {
    // TODO: You need to implement this
    // return "?newSAS";
    const result = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })
    // const json = ;
    return await result.json();
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
    await fetch(`${sas.url}&comp=block&blockid=${sas.base64}`, {
        method: "PUT",
        headers: {
            "Content-Type": contentType
        },
        body: await blobToArrayBuffer(file),
    })
    await fetch(`${sas.url}&comp=blocklist`, {
        method: 'PUT',
        headers: {
            "x-ms-blob-content-type": contentType
        },
        body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><BlockList><Latest>${sas.base64}</Latest></BlockList>`
    })

    return await fetch("/api/me/stickers", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: await getUserId(),
            token: '',
            sticker: {
                id: sas.id,
                src: sas.url.split('?').shift(),
                name: file.name.replace(/\..*$/, ""),
            }
        })
    })
}