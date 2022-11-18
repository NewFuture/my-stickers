import axios, { AxiosRequestConfig } from "axios";
import { getAuthToken } from "./teams";
import { BASE_URL, MAX_CONCURRENCY, MAX_WRITE_CONCURRENCY } from "../common/env";

const SessionKey = window.location.hash?.substring(1);
// Use the Content-Language to make the request to be the sample request avoid CORS options
const USER_SEESION_HEADER = "Content-Language";

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
        [USER_SEESION_HEADER]: SessionKey,
    },
});

API.interceptors.request.use((c) => {
    if (c.url?.startsWith("/admin/")) {
        // id token token
        return getAuthToken({ silent: true }).then((token) => {
            c.headers!["authorization"] = `Bearer ${token}`;
            return c;
        });
    }
    return c;
});

const Counter = {
    write: 0,
    all: 0,
};
function isWriteApi(conf: AxiosRequestConfig) {
    // upload: get sas token don't write DB or BlobStorage
    return conf.method !== "GET" && !conf.url?.endsWith("stickers/upload");
}
function clearRequest(conf: AxiosRequestConfig) {
    Counter.all = Math.max(0, Counter.all - 1);
    if (isWriteApi(conf)) {
        Counter.write = Math.max(0, Counter.write - 1);
    }
}

API.interceptors.request.use(
    (config) =>
        new Promise((resolve) => {
            const isWriting = isWriteApi(config);
            const tryRun = () => {
                // write API limit 2 concurrencies.
                // if only 1 writing by pass it.
                if (
                    (isWriting && Counter.write <= 1) ||
                    (Counter.all < MAX_CONCURRENCY && (!isWriting || Counter.write < MAX_WRITE_CONCURRENCY))
                ) {
                    Counter.all++;
                    Counter.write += Number(isWriting);
                    resolve(config);
                } else {
                    setTimeout(tryRun, 250);
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
