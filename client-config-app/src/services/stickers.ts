import { API, myList, tenantList } from "./http";
import type { Sticker } from "../model/sticker";
import { SasInfo, upload } from "./blob";
import { MAX_BATCH_COUNT } from "../common/env";

export async function uploadSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const commitInfo = await uploadToBlob(`${myList}/upload`, file, onProgressUpdate, userQueue);
    return pushQueue(userQueue, commitInfo, batchUserCommit);
}

export async function uploadTenantSticker(file: File, onProgressUpdate: (percent: number) => void) {
    const commitInfo = await uploadToBlob(`${tenantList}/upload`, file, onProgressUpdate, tenantQueue);
    return pushQueue(tenantQueue, commitInfo, batchTenantCommit);
}

export function deleteSticker(sticker: Pick<Sticker, "id" | "src">): Promise<any> {
    return API.delete(`${myList}/${sticker.id}`, { data: { src: sticker.src } });
}

export function patchSticker(id: string, data: Partial<Sticker>) {
    return API.patch(`${myList}/${id}`, data).then((res) => res.data);
}

export function deleteTenantSticker(sticker: Pick<Sticker, "id" | "src">): Promise<any> {
    return API.delete(`${tenantList}/${sticker.id}`, { data: { src: sticker.src } });
}

export function patchTenantSticker(id: string, data: Partial<Sticker>) {
    return API.patch(`${tenantList}/${id}`, data).then((res) => res.data);
}

function batchUserCommit(list: CommitInfo[]) {
    return API.post(`${myList}/batchCommit`, list).then((r) => r.data);
}
function batchTenantCommit(list: CommitInfo[]) {
    return API.post(`${tenantList}/batchCommit`, list).then((r) => r.data);
}

interface UploadQueue {
    uploadCounter: number;
    list: {
        commit: CommitInfo;
        resolve: (sticker: Sticker) => any;
        reject: (err: any) => void;
    }[];
    timmer: number;
}

const userQueue: UploadQueue = {
    uploadCounter: 0,
    list: [],
    timmer: 0,
};

const tenantQueue: UploadQueue = {
    uploadCounter: 0,
    list: [],
    timmer: 0,
};

// commit 请求队列
let commitRequests = 0;
function pushQueue(
    queue: UploadQueue,
    commit: CommitInfo,
    batchCommit: (commitList: CommitInfo[]) => Promise<Sticker[]>,
): Promise<Sticker> {
    return new Promise<Sticker>((resolve, reject) => {
        clearTimeout(queue.timmer);
        const flushQueue = () => {
            clearTimeout(queue.timmer);
            const list = queue.list;
            queue.list = [];
            queue.timmer = 0;
            commitRequests += 1;
            console.debug("flush", list, queue.uploadCounter);
            batchCommit(list.map((l) => l.commit))?.then(
                (stickers) => {
                    commitRequests -= 1;
                    list.forEach((item) => {
                        const sticker = stickers.find((s) => s.id === item.commit.id);
                        if (!sticker?.src) {
                            item.reject(sticker?.name);
                        } else {
                            item.resolve(sticker);
                        }
                    });
                },
                (err) => {
                    commitRequests -= 1;
                    list.forEach((item) => item.reject(err));
                },
            );
        };
        if (
            queue.list.push({ commit, resolve, reject }) >= MAX_BATCH_COUNT ||
            (queue.uploadCounter <= 0 && commitRequests <= 0)
        ) {
            flushQueue();
        } else {
            queue.timmer = window.setTimeout(flushQueue, 1000);
        }
    });
}

interface CommitInfo {
    id: string;
    name: string;
    contentType: string;
    weight?: number;
}

async function uploadToBlob(
    url: `${typeof myList | typeof tenantList}/upload`,
    file: File,
    onProgressUpdate: (percent: number) => void,
    queue: UploadQueue,
): Promise<CommitInfo> {
    queue.uploadCounter = Math.max(1, queue.uploadCounter + 1);
    try {
        const sasResult = await API.post<SasInfo[]>(url, { exts: [file.name.split(".").pop()!] });
        const result = await upload(file, sasResult.data[0], (p) => onProgressUpdate(p.percent));
        queue.uploadCounter = Math.max(0, queue.uploadCounter - 1);
        return result;
    } catch (error) {
        queue.uploadCounter = Math.max(0, queue.uploadCounter - 1);
        console.error(`upload file ${file.name}`, error);
        throw error;
    }
}

export function isIdle() {
    return userQueue.list.length <= 0 && tenantQueue.list.length <= 0 && commitRequests <= 0;
}
