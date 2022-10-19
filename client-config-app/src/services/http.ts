import axios, { AxiosRequestConfig } from "axios";
import { getAuthToken } from "./teams";
import { BASE_URL } from "../common/env";

const SessionKey = window.location.hash?.substring(1);
const USER_SEESION_HEADER = "Session-Key";

// export const enum APIs {
//     userStickers = "/me/stickers",
//     userUpload = "/me/stickers/upload",
//     userCommit = "/me/stickers/commit",
//     adminCommit = "/admin/stickers/commit"
// }

export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((c) => {
    if (c.url?.startsWith("/admin/")) {
        // id token token
        return getAuthToken({ silent: true }).then((token) => {
            c.headers!["authorization"] = `Bearer ${token}`;
            return c;
        });
    } else {
        c.headers![USER_SEESION_HEADER] = SessionKey;
    }
    return c;
});

/**
 * 最大并发数
 */
const MAX_CONCURRENCY = 4;
const MAX_WRITE_CONCURRENCY = 2;
let totalPendingRequest = 0;
let writingRequest = 0;

function isWriteApi(conf: AxiosRequestConfig) {
    // get sas token don't write DB or BlobStorage
    return conf.method !== "GET" && !conf.url?.endsWith("stickers/upload");
}
function clearRequest(conf: AxiosRequestConfig) {
    totalPendingRequest = Math.max(0, totalPendingRequest - 1);
    if (isWriteApi(conf)) {
        writingRequest = Math.max(0, writingRequest - 1);
    }
}

API.interceptors.request.use(
    (config) =>
        new Promise((resolve) => {
            const isWriting = isWriteApi(config);
            const isBypass = config.url?.endsWith("/stickers"); // bypass list api
            const tryRun = () => {
                // for by pass API send it without any limit, but count for other requests
                // for writing api should low the the writing limit
                if (
                    isBypass ||
                    (totalPendingRequest < MAX_CONCURRENCY && (!isWriting || writingRequest < MAX_WRITE_CONCURRENCY))
                ) {
                    totalPendingRequest++;
                    writingRequest += Number(isWriting);
                    resolve(config);
                } else {
                    setTimeout(tryRun, 200);
                }
            };
            tryRun();
        }),
);
API.interceptors.response.use(
    (response) => {
        clearRequest(response.config);
        return response;
    },
    (error) => {
        clearRequest(error.config);
        return Promise.reject(error);
    },
);
