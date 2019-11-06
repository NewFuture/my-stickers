import { createHash } from "crypto";
import { ENV } from "../config";

function sha256(data: string): string {
    return createHash("sha256").update(data).digest("base64");
    //                                               ------  binary: hash the byte string
}

/**
 * 生成token
 * @param id 用户ID
 * @param ttl 有效期 默认 30分钟
 */
export function generateToken(id: string, ttl = 30 * 60 * 1000): string {
    const expireDate = (Date.now() + ttl).toString();
    return `${expireDate}-${sha256(ENV.TOKEN_ENCRYPT_KEY + id + expireDate)}`;
}

/**
 * 校验token
 * 返回剩余有效期
 */
export function validateToken(id: string, token: string): number | false {
    const [expireDate, hash] = token.split("-");
    if (hash !== sha256(ENV.TOKEN_ENCRYPT_KEY + id + expireDate)) {
        return false;
    } else {
        return +expireDate - Date.now();
    }
}
