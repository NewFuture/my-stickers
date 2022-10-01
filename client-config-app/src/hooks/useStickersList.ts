import { API } from "../lib/http";
import useSWR, { SWRResponse } from "swr";
import type { Sticker } from "../model/sticker";

const fetcher = (url: string) => API.get<{ values: Sticker[] }>(url).then((res) => res.data?.values);

export function isUnauthorizedError(err: any) {
    return err?.response?.status === 401
}
interface StickerListResult extends SWRResponse<Sticker[], any> {
    isLoading?: boolean;
}

export function useStickersList(isTenant: boolean): StickerListResult {
    const url = isTenant ? `/admin/stickers` : "/me/stickers";
    const result: StickerListResult = useSWR(url, fetcher, {
        refreshInterval: 5 * 60 * 1000,// 5 mins
        focusThrottleInterval: 10 * 1000,//10s
        revalidateIfStale: false, // automatically revalidate even if there is stale data 
        errorRetryCount: 5,
        shouldRetryOnError: (err) => {
            return !isUnauthorizedError(err);
        },
    });
    result.isLoading = !result.data && !result.error;
    return result;
}
