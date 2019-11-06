import { TurnContext, MessagingExtensionResult, ActionTypes } from "botbuilder";
import { getConfigUrl } from "./getConfigUrl";

export async function querySettingsUrl(context: TurnContext): Promise<MessagingExtensionResult> {
    // const id = context.activity.from.id;
    const extension: MessagingExtensionResult = {
        suggestedActions: {
            actions: [{
                type: ActionTypes.OpenUrl,
                title: "Setting",
                value: getConfigUrl(context)
            }],
        },
        type: "config",
    };
    return Promise.resolve(extension);
}