import { TurnContext } from "botbuilder";
import { Config } from "../config";

export function getConfigUrl(context: TurnContext) {
    return `https://${Config.STATIC_SITE}/${Config.CONFIG_PATH}?token=${context.activity.from.aadObjectId}`;
}