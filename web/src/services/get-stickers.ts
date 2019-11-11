import { API } from "../lib/http";
export interface Sticker {
    src: string;
    id: string | number;
    name?: string;
}

export async function getStickers(): Promise<Sticker[]> {
    const result = await API.get<{ values: Sticker[] }>("/me/stickers");
    return result.data.values;
}