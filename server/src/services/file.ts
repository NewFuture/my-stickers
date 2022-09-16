import * as azure from "azure-storage";
import { ENV } from "../config";
import { uuidUrlSafeEncode } from "../util/base64";
import { generateUuid } from "../util/uuid";

const container = ENV.AZURE_STORAGE_CONTAINER;
const blobService = azure.createBlobService(ENV.AZURE_STORAGE_ACCOUNT_NAME!, ENV.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!);

export interface SasInfo {
    /**
     * Base64编码的ID
     */
    id: string;
    // base64?: string;
    token: string;
    url: string;
}

/**
 * 生成长传的SAS token和文件
 * @param userId
 * @param ext 不带点后缀名
 */
export function getSasToken(userId: string, ext: string): SasInfo {
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 10);
    startDate.setMinutes(startDate.getMinutes() - 100);

    const sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
            Start: startDate,
            Expiry: expiryDate,
        },
    };
    const id = generateUuid();
    // const id: string = base64EncodeUUID();
    const fileName = `${uuidUrlSafeEncode(userId)}/${uuidUrlSafeEncode(id)}.${ext}`;
    const token = blobService.generateSharedAccessSignature(container, fileName, sharedAccessPolicy);
    const url = blobService.getUrl(container, fileName, token, true);
    return { token, url, id };
}

/**
 * 确认上传
 * @param userId
 * @param id
 * @param extWithDot 带.后缀
 * @param contentType
 */
export function commitBlocks(userId: string, id: string, extWithDot: string, contentType: string): Promise<string> {
    const fileName = `${uuidUrlSafeEncode(userId)}/${uuidUrlSafeEncode(id)}${extWithDot}`;
    return new Promise((resolve, reject) =>
        blobService.commitBlocks(
            container,
            fileName,
            { LatestBlocks: [id] },
            { contentSettings: { contentType } },
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`https://${ENV.AZURE_STORAGE_CDN}/${container}/${fileName}`);
                }
            },
        ),
    );
}
