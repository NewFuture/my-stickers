import type { SWRConfiguration } from "swr";
import { myList, tenantList } from "../services/http";

export const swrConfig: SWRConfiguration & { provider?: () => any } = {
    focusThrottleInterval: 30 * 1000, // 30 s
    revalidateIfStale: false, // automatically revalidate even if there is stale data
    revalidateOnMount: true,
    errorRetryCount: 4,
    dedupingInterval: 30 * 1000,
    shouldRetryOnError: (err: any) => err?.response?.status >= 429,
    fallback: {
        [myList]: JSON.parse(localStorage.getItem(myList)!),
        [tenantList]: JSON.parse(localStorage.getItem(tenantList)!),
    },
    onSuccess(data, key, config) {
        if (key in config.fallback) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    },
};
