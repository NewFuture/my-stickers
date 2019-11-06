import { TurnContext } from "botbuilder";
import { ENV } from "../config";
import { generateToken } from "../services/token";

export function getConfigUrl(context: TurnContext) {
    return `https://${ENV.WEB_HOST}${ENV.WEB_CONFIG_PATH}?token=${generateToken(context.activity.from.aadObjectId!)}`;
}