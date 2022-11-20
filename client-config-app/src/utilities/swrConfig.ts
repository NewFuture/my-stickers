import { teamsCore } from "@microsoft/teams-js";
import type { SWRConfiguration } from "swr";

const cacheKey = "stickers-cache";

function localStorageProvider() {
    // When initializing, we restore the data from `localStorage` into a map.
    const map = new Map(JSON.parse(localStorage.getItem(cacheKey) || "[]"));
    const save = () => {
        const appCache = JSON.stringify(Array.from(map.entries()));
        localStorage.setItem(cacheKey, appCache);
        return true;
    };
    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener("beforeunload", save);
    teamsCore.registerBeforeUnloadHandler(save);

    // We still use the map for write & read for performance.
    return map;
}

export const swrConfig: SWRConfiguration & { provider?: () => any } = {
    provider: localStorageProvider,
    focusThrottleInterval: 30 * 1000, // 30 s
    revalidateIfStale: false, // automatically revalidate even if there is stale data
    revalidateOnMount: true,
    errorRetryCount: 4,
    dedupingInterval: 30 * 1000,
    shouldRetryOnError: (err: any) => err?.response?.status >= 429,
};
