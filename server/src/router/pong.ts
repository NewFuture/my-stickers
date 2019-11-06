import { Strings } from "../locale";
import { Request, Response } from "express";

export default function pong(req: Request, res: Response, next) {
    res.status(200).send(res.__(Strings.pong)).end();
    next && next();
}