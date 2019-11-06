
import { Router } from "express";
import * as debug from "debug";
import { TeamsMiddleware, TeamsAdapter, TeamsActivityProcessor } from "botbuilder-teams";
import { MessagingExtensionMiddleware } from "../messageExtension/MessageExtensionMiddleware";
import MyCollectionComposeExtension from "../messageExtension/MyCollection";
import CollectMessageExtension from "../messageExtension/Collect";

const log = debug("stickers:bot");

export function botRouter(appId: string, appPassword: string) {
    const router = Router();
    const adapter = new TeamsAdapter({
        appId,
        appPassword,
    });

    // Create the conversation state
    // const conversationState = new ConversationState(botSettings.storage, botSettings.namespace);

    // generic error handler
    adapter.onTurnError = async (context, error) => {
        log(`[onTurnError]: ${error}`);
        await context.sendActivity(`Oops. Something went wrong!`);
        // await conversationState.delete(context);
    };
    // Create the Bot
    // const bot: IBot = new component(conversationState, adapter);
    // const bot = new UniversalBot();
    // add the Microsoft Teams middleware
    adapter.use(new TeamsMiddleware());
    // add the Messaging Extension Middleware
    adapter.use(new MessagingExtensionMiddleware("mycollection", new MyCollectionComposeExtension()));
    adapter.use(new MessagingExtensionMiddleware("collect", new CollectMessageExtension()));

    // const bot = new bot.
    const activityProc = new TeamsActivityProcessor();
    router.use((req, res, next) => {
        adapter.processActivity(req, res, async (turnContext): Promise<any> => {
            turnContext.turnState.set('req', req)
            try {
                await activityProc.processIncomingActivity(turnContext);
                if (next) { next(); }
            } catch (err) {
                adapter.onTurnError(turnContext, err);
            }
        });
    });
    return router;
}
