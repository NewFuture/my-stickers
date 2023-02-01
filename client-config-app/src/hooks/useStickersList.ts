import { API, myList, tenantList } from "../services/http";
import useSWR, { SWRResponse } from "swr";
import type { Sticker } from "../model/sticker";

const fetcher = (url: string) => API.get<{ values: Sticker[] }>(url).then((res) => res.data?.values);

interface StickerListResult extends SWRResponse<Sticker[], any> {
    isLoading?: boolean;
}

export function useStickersList(isTenant: boolean): StickerListResult {
    const url = isTenant ? tenantList : myList;
    const result: StickerListResult = useSWR(url, fetcher, {
        refreshInterval: (isTenant ? 5 : 10) * 60 * 1000, // 10 mins
        revalidateOnFocus: isTenant, // only for tenant
    });
    return result;
}
