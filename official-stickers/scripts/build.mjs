"strict"
import fs from 'fs';
import path from 'path';
import {
    promisify
} from 'util';

const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

const OUTPU_FOLDER = "build";
const URL_PREFIX = "official-stickers/"

const output = {
    updateAt: new Date().toISOString(),
    stickers: []
}

// We might want to change this path to be absolute path 
// Otherwise the command could be run only under the official-stickers folder.
const __dirname = path.resolve();
const root = path.join(__dirname)

const buildStickers = (filePath) => {
    const dirPath = fs.readdirSync(filePath);
    dirPath.forEach(async (collectionFolderOrOther, index) => {
        const info = fs.statSync(path.join(filePath, collectionFolderOrOther))
        if (info.isDirectory() && collectionFolderOrOther !== "scripts" && collectionFolderOrOther !== "build") {

            const collentionFolder = collectionFolderOrOther;
            let index;

            try {
                index = JSON.parse(await readFile(`${collentionFolder}/index.json`));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.error("Miss the index.json file for ", collentionFolder, " skip..");
                    return
                }
            }

            await mkdir(path.join(OUTPU_FOLDER, collentionFolder), {recursive: true});
            const stickers = await Promise.all(index.stickers.map(async (s) => {
                const newPath = `${OUTPU_FOLDER}/${collentionFolder}/${s.img}`; // to do build with content hash
                const generatedUrl = `${URL_PREFIX}${collentionFolder}/${s.img}`
                await copyFile(`${collentionFolder}/${s.img}`, newPath)
                return ({
                    type: index.type, // allow overwrite by s
                    ...s,
                    url: generatedUrl,
                    collection: index.collection,
                })
            }));

            output.stickers.push(...stickers);
            await writeFile(`${OUTPU_FOLDER}/index.json`, JSON.stringify(output));
        }
    })
}

buildStickers(root);