import { TurnContext } from "botbuilder";

const ConfigURL = `https://${process.env.HOSTNAME}/index.html`;

export function getConfigUrl(context: TurnContext) {
    return `${ConfigURL}?token=${context.activity.from.id}`;
}