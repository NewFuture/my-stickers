import axios, { type AxiosProgressEvent } from "axios";
import { MAX_CONCURRENCY } from "../common/env";

export const blob = axios.create();

let PENDING_REQUESTS = 0;

/**
 * Axios Request Interceptor
 */
blob.interceptors.request.use(
    (config) =>
        new Promise((resolve) => {
            let interval = setInterval(() => {
                if (PENDING_REQUESTS < MAX_CONCURRENCY) {
                    PENDING_REQUESTS++;
                    clearInterval(interval);
                    resolve(config);
                }
            }, 200);
        }),
);
blob.interceptors.response.use(
    (response) => {
        PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
        return response;
    },
    (error) => {
        PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
        return Promise.reject(error);
    },
);

export interface SasInfo {
    id: string;
    url: string;
}

export async function upload(
    file: File,
    sas: SasInfo,
    onProgress: (p: { percent: number; p: AxiosProgressEvent }) => void,
) {
    const contentType = file.type;
    await blob.put(`${sas.url}&comp=block&blockid=${encodeURIComponent(btoa(sas.id))}`, file, {
        onUploadProgress: (p) => onProgress({ percent: 100 * (p.loaded / (p.total || p.bytes)), p }),
    });
    return {
        id: sas.id,
        name: file.name,
        contentType,
        weight: 0,
    };
}
