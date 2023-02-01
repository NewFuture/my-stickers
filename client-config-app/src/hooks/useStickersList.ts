import { API, myList, tenantList } from "../services/http";
import useSWR from "swr";
import type { Sticker } from "../model/sticker";

const fetcher = (url: string) => API.get<{ values: Sticker[] }>(url).then((res) => res.data?.values);

export function useStickersList(isTenant: boolean) {
    const url = isTenant ? tenantList : myList;
    const result = useSWR(url, fetcher, {
        refreshInterval: (isTenant ? 5 : 10) * 60 * 1000, // 10 mins
        revalidateOnFocus: isTenant, // only for tenant
    });
    return result;
}
