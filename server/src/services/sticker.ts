import { generateUuid } from "../util/uuid";
import { insert, query, del, renewWeight, updateName } from "./database";
import { ENV } from "../config";

const cache = new Map<string, Sticker[]>();
// tslint:disable-next-line: radix
const MAX = parseInt(ENV.STICKERS_MAX_NUM!);
// tslint:disable-next-line: interface-name
export interface Sticker {
    src: string;
    id: string;
    name?: string;
}

/**
 * 获取用户表情
 * @param userId
 */
export async function getUserStickers(userId: string): Promise<Sticker[]> {
    if (cache.has(userId)) {
        return Promise.resolve(cache.get(userId)!);
    }
    const dbResult = await query(userId);
    cache.set(userId, dbResult || []);
    return dbResult || [];
}


/**
 * 模糊搜索
 * @param userId
 * @param q
 */
export async function searchUserStickers(userId: string, search: string): Promise<Sticker[]> {
    const stickers = await getUserStickers(userId);
    const reg = new RegExp(search.trim().replace(/\s+/g, ".*"));
    return stickers.filter(s => s.name && reg.test(s.name));

}

/**
 * 添加用户表情
 * @param userId
 * @param stickers
 */
export async function addUserStickers(userId: string, stickers: Array<Omit<Sticker, "id"> & { id?: string }>): Promise<Sticker[]> {
    if (!userId || !stickers || stickers.length === 0) {
        return Promise.reject("no stickers add");
    }
    return getUserStickers(userId).then(savedStickers => {
        cache.delete(userId);
        const updateStickers: Sticker[] = [];
        for (let index = 0, newSticker = 0; index < stickers.length; index++) {
            const sticker = stickers[index];
            const savedOne = savedStickers.find(s => s.src === sticker.src);
            if (savedOne) {
                // 已保存的更新权重
                renewWeight(savedOne.id);
                updateStickers.push(savedOne);
            } else if (newSticker + savedStickers.length <= MAX) {
                // 未保存自动保存
                if (!sticker.id) {
                    sticker.id = generateUuid();
                    updateStickers.push(sticker as Sticker);
                }
                ++newSticker;
                insert(sticker.id, userId, sticker.src, sticker.name);
            }
        }
        cache.delete(userId);
        return updateStickers;
    });
}

/**
 * 删除表情
 * @param userId
 * @param stickerId
 */
export async function deleteUserSticker(userId: string, stickerId: string) {
    const stickers = await getUserStickers(userId);
    const deleteSticker = stickers && stickers.find(s => s.id === stickerId);
    if (deleteSticker) {
        await del(stickerId);
        cache.delete(userId);
    }
}

/**
 * 修改名称
 */
export async function updateStickerName(userId: string, stickerId: string, name: string) {
    name = (name || "").trim();
    const stickers = await getUserStickers(userId);
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) {
        return Promise.reject("not found");
    } else if (sticker.name !== name) {
        return await updateName(stickerId, name);
    }
    return Promise.resolve(sticker);
}
