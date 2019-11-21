
import * as path from "path";

import { Router } from "express";
import * as debug from "debug";

import { getSasToken, commitBlocks } from "../services/file";
import { addUserStickers, getUserStickers, deleteUserSticker, updateStickerName } from "../services/sticker";
import { authorize } from "../middleware/authorize";

const log = debug("router:api");

const apiRouter = Router();
// middleware that is specific to this router
apiRouter.use(authorize);

apiRouter.use((req, res, next) => {
    log(req.userId, req.path);
    next();
});

interface UploadRequest {
    user: string;
    token: string;
    exts: string[];
}

/**
 * 获取上传SAS token
 */
apiRouter.post("/upload", (req, res, next) => {
    const body: UploadRequest = req.body;
    const allSAS = body.exts.map(ext => getSasToken(req.userId, ext));
    res.send(allSAS);
    next();
});



interface PostStickerBlobRequest {
    id: string;
    name: string;
    contentType: string;
}
/**
 * 完成上传
 */
apiRouter.post("/stickers/commit", async (req, res, next) => {
    const { name, id, contentType }: PostStickerBlobRequest = req.body;
    const ext = path.extname(name);
    try {
        const src = await commitBlocks(req.userId, id, ext, contentType);
        const info = await addUserStickers(req.userId, [{
            id,
            src,
            name: path.basename(name, ext)
        }]);
        res.send(info[0]);
        next();
    } catch (error) {
        log("add fail", error);
        res.statusCode = 500;
        res.send(error);
    }
});

/**
 * 拉取列表
 */
apiRouter.get("/me/stickers", async (req, res, next) => {
    try {
        const stickers = await getUserStickers(req.userId);
        res.send({ values: stickers });
        next();
    } catch (error) {
        if (error === "not found") {
            res.send({ values: [] });
            next();
        } else {
            log("load stickers fail", error);
            res.statusCode = 500;
            res.send(error);
        }
    }
});

/**
 * 删除表情
 */
apiRouter.delete("/stickers/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteUserSticker(req.userId, id);
        res.send({});
        next();
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }
});

interface PatchStickerRequest {
    name: string;
}
/**
 * 修改表情
 */
apiRouter.patch("/stickers/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const name = (req.body as PatchStickerRequest).name;
        await updateStickerName(req.userId, id, name);
        res.send({});
        next();
    } catch (error) {
        res.statusCode = 500;
        res.send(error);
    }
});

export { apiRouter };