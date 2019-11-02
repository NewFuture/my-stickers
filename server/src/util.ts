import { TurnContext } from "botbuilder";

export function getUserId(context: TurnContext) {
    return context.activity.from.aadObjectId || context.activity.from.id;
}