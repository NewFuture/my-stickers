
import * as debug from "debug";
import { Router } from "express";
import { BotFrameworkAdapter, MessagingExtensionActionResponse } from "botbuilder";

import { ENV } from "../config";
import { querySettingsUrl, submitAction, queryMyCollection, fetchTaskCollect } from "../teams";

const log = debug("router:bot");
const botRouter = Router();

const adapter = new BotFrameworkAdapter({
    appId: ENV.MICROSOFT_APP_ID,
    appPassword: ENV.MICROSOFT_APP_PASSWORD,
});

// generic error handler
adapter.onTurnError = async (context, error) => {
    log(`[onTurnError]: ${error}`);
    await context.sendActivity(`Oops. Something went wrong!`);
};

botRouter.post("/", (req, res, next) => {
    log("message recieved");
    adapter.processActivity(req, res, async (turnContext): Promise<any> => {
        try {
            let body: MessagingExtensionActionResponse = {};
            switch (turnContext.activity.name) {
                case "composeExtension/query":
                    body = {
                        composeExtension: await queryMyCollection(turnContext, turnContext.activity.value),
                    }
                    break;
                case "composeExtension/querySettingUrl":
                    body = {
                        composeExtension: await querySettingsUrl(turnContext),
                    }
                    break;
                case "composeExtension/setting":
                    body = {};
                    break;
                case "composeExtension/submitAction":
                    body = {
                        composeExtension: await submitAction(turnContext, turnContext.activity.value),
                    }
                    break;
                case "composeExtension/fetchTask":
                    body = await fetchTaskCollect(turnContext, turnContext.activity.value);
                    break;
                case "composeExtension/onCardButtonClicked":
                case "composeExtension/selectItem":
                default:
                    log(turnContext.activity.name, "no handler");
                    break;
            }
            turnContext.sendActivity({
                type: "invokeResponse",
                value: {
                    body,
                    status: 200,
                }
            });
            next();
        } catch (err) {
            log("err", err);
            if (next) { next(err); }
        }
    });
});

export { botRouter };
