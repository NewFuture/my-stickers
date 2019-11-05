import { TurnContext } from "botbuilder";
import { Config } from "../config";

export function getConfigUrl(context: TurnContext) {
    return `https://${Config.WEB_HOST}/${Config.WEB_CONFIG_PATH}?token=${context.activity.from.aadObjectId}`;
}