import { Request, Response } from "express";
import * as debug from "debug";

import { Locale } from "../config";

const log = debug("router:ping");

/**
 * API 测试
 * @param req
 * @param res
 * @param next
 */
export function pingHandler(req: Request, res: Response, next?: any) {
    log("called", req.query);
    res.status(200).send(res.__(Locale.pong)).end();
    next && next();
}
