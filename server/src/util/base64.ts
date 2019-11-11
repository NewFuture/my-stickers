// export function base64Encode(unencoded: string): string {
//     return Buffer.from(unencoded).toString("base64");
// }

// function decode(encoded: string) {
//     return new Buffer(encoded || "", "base64").toString("utf8");
// }

/**
 * Base 64 转URLSafe base 64
 * https://tools.ietf.org/html/rfc4648#section-5
 * @param base64
 */
export function base64ToUrlSafe(base64: string) {
    // const encoded = encode(unencoded);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * urlSafe 64 转 base64
 * https://tools.ietf.org/html/rfc4648#section-5
 * @param urlSafe
 */
export function urlSafeToBase64(urlSafe: string) {
    urlSafe = urlSafe.replace(/-/g, "+").replace(/_/g, "/");
    while (urlSafe.length % 4) {
        urlSafe += "=";
    }
    return urlSafe;
}

/**
 * UUID 转 Base64
 * @param uuid
 */
export function base64EncodeUUID(uuid: string) {
    return Buffer.from(uuid.replace(/-/g, ""), "hex").toString("base64");
}

/**
 * Base64 转 UUID
 * @param encoded
 * @param slice 是否加入`-`分隔符
 */
export function base64DecodeUUID(encoded: string, slice = true) {
    const hex = Buffer.from(encoded, "base64").toString("hex");
    if (slice) {
        const m = hex.match(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/)!;
        return [m[1], m[2], m[3], m[4], m[5]].join("-");
    } else {
        return hex;
    }
}

/**
 * UUID 转 URL safe Base64
 * @param uuid
 */
export function uuidUrlSafeEncode(uuid: string) {
    return base64ToUrlSafe(base64EncodeUUID(uuid));
}

/**
 * URL Safe 64 转 UUID
 * @param encoded
 */
export function uuidUrlSafeDecode(encoded: string) {
    return base64DecodeUUID(urlSafeToBase64(encoded));
}
