// import {
//     BlobServiceClient,
//     StorageSharedKeyCredential
// } from "@azure/storage-blob";

// const c= new BlobServiceClient("")
// // c.sas
// const s = new StorageSharedKeyCredential("","")
// s.create({},)
// // const express = require('express');
// // const router = express.Router();
// // const multer = require('multer');
// // const inMemoryStorage = multer.memoryStorage();
// // const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
// // const getStream = require('into-stream');
// // const containerName = 'images';
// // const ONE_MEGABYTE = 1024 * 1024;
// // const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
// // const ONE_MINUTE = 60 * 1000;

// // const sharedKeyCredential = new SharedKeyCredential(
// //     process.env.AZURE_STORAGE_ACCOUNT_NAME,
// //     process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
// // const pipeline = StorageURL.newPipeline(sharedKeyCredential);
// // const serviceURL = new ServiceURL(
// //     `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
// //     pipeline
// // );

// // const getBlobName = originalName => {
// //     // Use a random number to generate a unique file name,
// //     // removing "0." from the start of the string.
// //     const identifier = Math.random().toString().replace(/0\./, '');
// //     return `${identifier}-${originalName}`;
// // };

// // router.post('/', uploadStrategy, async (req, res) => {

// //     const aborter = Aborter.timeout(30 * ONE_MINUTE);
// //     const blobName = getBlobName(req.file.originalname);
// //     const stream = getStream(req.file.buffer);
// //     const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
// //     const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

// //     try {

// //         await uploadStreamToBlockBlob(aborter, stream,
// //             blockBlobURL, uploadOptions.bufferSize, uploadOptions.maxBuffers,
// //             { blobHTTPHeaders: { blobContentType: "image/jpeg" } });

// //         res.render('success', { message: 'File uploaded to Azure Blob storage.' });

// //     } catch (err) {

// //         res.render('error', { message: err.message });

// //     }
// // });

// // module.exports = router;

// var azure = require('azure-storage');
import * as azure from "azure-storage";
import * as uuid from "uuid/v5";
import { Base64 } from "js-base64";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!;
const blobService = azure.createBlobService(accountName, accessKey);
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
    const token = blobService.generateSharedAccessSignature(containerName, fileName, sharedAccessPolicy);
    const url = blobService.getUrl(containerName, fileName, token, true);
    return { token, url, id, base64: Base64.encode(id) };
}
