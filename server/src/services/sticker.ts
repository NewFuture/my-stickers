import { generateUuid } from "../util/uuid";

const data = new Map<string, Sticker[]>();

export interface Sticker {
    src: string;
    id: string;
    name?: string;
}

/**
 * 获取用户表情
 * @param id
 */
export function getUserStickers(id: string): Promise<Sticker[]> {
    return data.has(id) ? Promise.resolve(data.get(id)!) : Promise.reject("not found");
}

function filterUserStickers(id: string, stickers: Array<Pick<Sticker, "name" | "src">>): Promise<Array<Pick<Sticker, "name" | "src">>> {
    return getUserStickers(id)
        .catch(() => [] as Sticker[])
        .then(allStickers => stickers.filter(s => !allStickers.find(all => all.src === s.src)));
}

/**
 * 添加用户表情
 * @param userId
 * @param stickers
 */
export function addUserStickers(userId: string, stickers: Array<Omit<Sticker, "id"> & { id?: string }>): Promise<Sticker[]> {
    if (!userId || !stickers || stickers.length === 0) {
        return Promise.reject("no stickers add");
    }
    return filterUserStickers(userId, stickers).then(s => {
        stickers.forEach(s => {
            if (!s.id) {
                s.id = generateUuid();
            }
        });
        data.set(userId, [...stickers as Sticker[], ...data.get(userId) || []]);
        return stickers as Sticker[];
    });
}
