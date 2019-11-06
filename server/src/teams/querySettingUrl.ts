import { TurnContext, MessagingExtensionResult, ActionTypes } from "botbuilder";
import { getConfigUrl } from "./getConfigUrl";
import { Request } from "express";

export async function querySettingsUrl(req: Request, context: TurnContext): Promise<MessagingExtensionResult> {
    // const id = context.activity.from.id;
    const extension: MessagingExtensionResult = {
        suggestedActions: {
            actions: [{
                type: ActionTypes.OpenUrl,
                title: "Setting",
                value: getConfigUrl(req.userId)
            }],
        },
        type: "config",
    };
    return Promise.resolve(extension);
}