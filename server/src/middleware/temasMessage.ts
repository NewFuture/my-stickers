import { Request, Response, } from "express";
import { StatusCodes, Activity } from "botbuilder";
import * as debug from "debug";

const log = debug("middle:messages");

function sendError(res: Response, error: string) {
    log(error);
    res.status(StatusCodes.BAD_REQUEST).send({ error });
}

/**
 * 验证用户Token,并注入用户Id
 * @param req
 * @param res
 * @param next
 */
export function temasMessage(req: Request, res: Response, next: () => void) {
    const body: Activity = req.body;
    if (!body || !body.from) {
        sendError(res, "invalidate message");
    } else if (!body.from.aadObjectId) {
        sendError(res, `ivalidate user:${body.from}`);
    } else {
        req.userId = body.from.aadObjectId;
        req.setLocale(body.locale || req.locale);
        next()
    }
}
