import { createHash } from "crypto";
import { Config } from "../config";

function sha256(data: string): string {
    return createHash("sha256").update(data).digest("base64");
    //                                               ------  binary: hash the byte string
}

/**
 * 生成token
 */
export function generateToken(id: string, ttl = 15 * 60 * 1000): string {
    const expireDate = (Date.now() + ttl).toString();
    return `${expireDate}-${sha256(Config.TOKEN_ENCRYPT_KEY + id + expireDate)}`;
}

/**
 * 校验token
 * 返回剩余有效期
 */
export function validateToken(id: string, token: string): number {
    const [expireDate, hash] = token.split("-");
    if (hash !== sha256(Config.TOKEN_ENCRYPT_KEY + id + expireDate)) {
        throw Error("token invalidate");
    } else if (+expireDate < Date.now()) {
        throw Error("token expired");
    } else {
        return +expireDate - Date.now();
    }
}
