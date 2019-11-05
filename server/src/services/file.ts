import * as azure from "azure-storage";
import * as uuid from "uuid/v5";
import { Base64 } from "js-base64";
import { Config } from "../config";


const blobService = azure.createBlobService(Config.AZURE_STORAGE_ACCOUNT_NAME!, Config.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!);
const containerName = "stickers";

export interface SasInfo {
    id: string;
    base64: string;
    token: string;
    url: string;
}

export function getSasToken(name: string, ext: string): SasInfo {

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 10);
    startDate.setMinutes(startDate.getMinutes() - 100);

    const sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
            Start: startDate,
            Expiry: expiryDate
        }
    };

    const id: string = uuid(name, uuid.URL);
    const fileName = `${name}/${id}.${ext}`;
    const token = blobService.generateSharedAccessSignature(Config.AZURE_STORAGE_CONTAINER, fileName, sharedAccessPolicy);
    const url = blobService.getUrl(Config.AZURE_STORAGE_CONTAINER, fileName, token, true);
    return { token, url, id, base64: Base64.encode(id) };
}
