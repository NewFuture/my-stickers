import * as debug from "debug";
import { MessagingExtensionResult, TaskModuleRequest } from "botbuilder";
import { Request } from "express";

const log = debug("onSubmit");
/**
 * 弹框后的 actions 操作
 * @param context
 * @param value
 */
export async function submitAction(req: Request, value: TaskModuleRequest): Promise<MessagingExtensionResult> {
    // Handle the Action.Submit action on the adaptive card
    log(value);
    const result: MessagingExtensionResult = {
        type: "message",
        text: "submitted",
    };

    return Promise.resolve(result);
}
