import { BotDeclaration, MessageExtensionDeclaration, IBot } from "express-msteams-host";
import { TurnContext, MemoryStorage, ConversationState } from "botbuilder";
import MyCollectionComposeExtension from "../messageExtension/MyCollection";
import { TeamsActivityProcessor } from "botbuilder-teams";
import CollectMessageExtension from "../messageExtension/Collect";
import * as debug from "debug";

// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for mycollection Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class StickerBot implements IBot {
    private readonly conversationState: ConversationState;
    /**
     * Local property for MycollectionMessageExtension
     */
    @MessageExtensionDeclaration("mycollection")
    private mycollectionMessageExtension: MyCollectionComposeExtension;
    @MessageExtensionDeclaration("collect")
    private collectMessageExtension: CollectMessageExtension;
    private readonly activityProc = new TeamsActivityProcessor();

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        // Message extension MycollectionMessageExtension
        this.mycollectionMessageExtension = new MyCollectionComposeExtension();
        this.collectMessageExtension = new CollectMessageExtension();

        this.conversationState = conversationState;

    }

    /**
     * The Bot Framework `onTurn` handlder.
     * The Microsoft Teams middleware for Bot Framework uses a custom activity processor (`TeamsActivityProcessor`)
     * which is configured in the constructor of this sample
     */
    public async onTurn(context: TurnContext): Promise<any> {
        log("onTurn", context.activity.action);
        // transfer the activity to the TeamsActivityProcessor
        await this.activityProc.processIncomingActivity(context);
    }

}
