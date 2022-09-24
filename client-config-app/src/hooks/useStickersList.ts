import { API } from "../lib/http";
import useSWR, { SWRResponse } from "swr";
import type { Sticker } from "../model/sticker";

const fetcher = (url: string) =>
    API.get<{ values: Sticker[] }>(`${process.env.REACT_APP_API_ROOT}${url}` || `/api/${url}`).then(
        (res) => res.data?.values,
    );

interface StickerListResult extends SWRResponse<Sticker[], any> {
    isLoading?: boolean;
}

export function useStickersList(isTenant: boolean): StickerListResult {
    const url = isTenant ? "tenant/stickers" : "me/stickers";
    const result: StickerListResult = useSWR(url, fetcher);
    result.isLoading = !result.data && !result.error;
    return result;
}
