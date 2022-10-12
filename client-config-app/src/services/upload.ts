import Axios, { AxiosProgressEvent } from "axios";
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

export async function upload(
    file: File,
    sas: SasInfo,
    url: "/admin/stickers/commit" | "/me/stickers/commit",
    onProgress: (p: { percent: number; p: AxiosProgressEvent }) => void,
) {
    const contentType = file.type;
    await blob.put(`${sas.url}&comp=block&blockid=${btoa(sas.id)}`, file, {
        onUploadProgress: (p) => onProgress({ percent: 100 * (p.loaded / (p.total || p.bytes)), p }),
    });
    return await API.post(url, {
        id: sas.id,
        name: file.name,
        contentType,
    }).then((r) => r.data);
}
