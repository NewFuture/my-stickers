import { ENV } from "../config";
import { generateToken } from "../services/token";

export function getConfigUrl(id: string) {
    return `https://${ENV.WEB_HOST}${ENV.WEB_CONFIG_PATH}?id=${id}#${generateToken(id)}`;
}