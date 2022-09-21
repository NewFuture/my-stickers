"strict"
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

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


const collentionFolder = "0001";
const index = JSON.parse(await readFile(`${collentionFolder}/index.json`));

await mkdir(path.join(OUTPU_FOLDER, collentionFolder), { recursive: true });
const stickers = await Promise.all(index.stickers.map(async (s) => {
    const newPath = `${OUTPU_FOLDER}/${collentionFolder}/${s.img}`; // to do build with content hash
    await copyFile(`${collentionFolder}/${s.img}`, newPath)
    return ({
        type: index.type, // allow overwrite by s
        ...s,
        url: `${URL_PREFIX}${newPath}`,
        collection: index.collection,
    })
}));

output.stickers.push(...stickers);

await writeFile(`${OUTPU_FOLDER}/index.json`, JSON.stringify(output));