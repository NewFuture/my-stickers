
import * as debug from "debug";
import { Router } from "express";
import { getSasToken } from "../services/file";
import { Sticker, addUserStickers } from "../services/sticker";

const log = debug("router:api");

const apiRouter = Router();
// middleware that is specific to this router
apiRouter.use((req, res, next) => {
    log("Time: ", Date.now(), req.path, req.body);
    next();
});

interface UploadRequest {
    user: string;
    token: string;
    exts: string[];
}

apiRouter.post("/upload", (req, res, next) => {
    const body: UploadRequest = req.body;
    const allSAS = body.exts.map(ext => getSasToken(body.user, ext));
    res.send(allSAS);
    next();
});


interface PostStickerRequest {
    user: string;
    token: string;
    sticker: Sticker;
}

apiRouter.post("/me/stickers", async (req, res, next) => {
    const body: PostStickerRequest = req.body;
    try {
        const info = await addUserStickers(body.user, [body.sticker]);
        res.send(info[0]);
        next();
    } catch (error) {
        console.error("add error", error);
        res.statusCode = 500;
        res.send(error);
        next(error);
    }
});

export { apiRouter };
