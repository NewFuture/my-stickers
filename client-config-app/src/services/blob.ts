import axios from "axios";

export const blob = axios.create();

/**
 * 最大并发数
 */
const MAX_UPLOAD_CONCURRENCY = 4;
let PENDING_REQUESTS = 0;

/**
 * Axios Request Interceptor
 */
blob.interceptors.request.use(
    (config) =>
        new Promise((resolve) => {
            let interval = setInterval(() => {
                if (PENDING_REQUESTS < MAX_UPLOAD_CONCURRENCY) {
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
