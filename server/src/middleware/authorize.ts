import { Request, Response } from "express";
import { StatusCodes } from "botbuilder";
import * as debug from "debug";
import { validateToken } from "../services/token";

const log = debug("middle:authorize");

function sendError(res: Response, error: string) {
    // log(error);
    res.status(StatusCodes.UNAUTHORIZED).send({ error });
}

/**
 * 验证用户Token,并注入用户Id
 * @param req
 * @param res
 * @param next
 */
export function authorize(req: Request, res: Response, next?: () => void) {
    const authorization = req.headers.authorization;
    log(authorization);

    if (!authorization) {
        sendError(res, "authorization not found");
        return;
    }
    const [id, token] = authorization.split(" ", 2);

    if (!id || !token) {
        sendError(res, "authorization id, token cannot empty: " + id);
        return;
    }
    const result = validateToken(id, token);
    if (result === false) {
        sendError(res, "invalidate token for" + id);
    } else if (!(result > 0)) {
        sendError(res, "token expired");
    } else {
        req.userId = id;
        // tslint:disable-next-line: no-unused-expression
        next && next();
    }
}
