import { API } from "../services/http";
import useSWR, { SWRResponse } from "swr";
import type { Sticker } from "../model/sticker";

const fetcher = (url: string) => API.get<{ values: Sticker[] }>(url).then((res) => res.data?.values);

interface StickerListResult extends SWRResponse<Sticker[], any> {
    isLoading?: boolean;
}

export function useStickersList(isTenant: boolean): StickerListResult {
    const url = isTenant ? `/admin/stickers` : "/me/stickers";
    const result: StickerListResult = useSWR(url, fetcher, {
        refreshInterval: (isTenant ? 5 : 10) * 60 * 1000, // 10 mins
        revalidateOnFocus: isTenant, // only for tenant
    });
    result.isLoading = !result.data && !result.error;
    return result;
}
