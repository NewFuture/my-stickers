import { TurnContext } from "botbuilder";
import { Config } from "../config";
import { generateToken } from "../services/token";

export function getConfigUrl(context: TurnContext) {
    return `https://${Config.WEB_HOST}${Config.WEB_CONFIG_PATH}?token=${generateToken(context.activity.from.aadObjectId!)}`;
}