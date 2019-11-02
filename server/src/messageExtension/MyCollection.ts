import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory } from "botbuilder";
import { MessagingExtensionQuery, MessagingExtensionResult, MessagingExtensionAttachment, MessagingExtensionSuggestedAction } from "botbuilder-teams";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { Sticker, getUserStickers } from "../services/sticker";
import { getConfigUrl } from "../config";
import { getUserId } from "../util";

// Initialize debug logging module
const log = debug("msteams");


/**
 * 表情数据转成卡片资源
 * @param sticker 
 */
function stickerToCard(sticker: Sticker): MessagingExtensionAttachment {
    const card: MessagingExtensionAttachment = CardFactory.adaptiveCard({
        type: "AdaptiveCard",
        version: "1.0",
        body: [{
            url: sticker.src,
            altText: sticker.name,
            type: "Image",
            spacing: "None",
            horizontalAlignment: "center",
        }]
    });
    card.preview = CardFactory.thumbnailCard(sticker.name || '', [sticker.src]);
    return card;
}

export default class MyCollectionComposeExtension implements IMessagingExtensionMiddlewareProcessor {

    /**
     * 表情选择款弹出或者搜索
     * @param context 
     * @param query 
     */
    public async onQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
        const id = getUserId(context);
        log("onQuery", id, query);
        try {
            const stickers = await getUserStickers(id);
            return {
                type: "result",
                attachmentLayout: "grid",
                attachments: stickers.map(stickerToCard)
            };
        } catch (error) {
            return {
                type: "config",
                text: "upload",
                suggestedActions: {
                    actions: [{
                        type: "openUrl",
                        displayText: "上传",
                        title: "upload stickers",
                        image: "https://cataas.com/cat/gif",
                        text: "UPLOAD",
                        value: getConfigUrl(context)
                    }]
                } as MessagingExtensionSuggestedAction,
            }
        }
    }

    // this is used when canUpdateConfiguration is set to true
    public async onQuerySettingsUrl(context: TurnContext): Promise<{ title: string, value: string }> {
        // const id = context.activity.from.id;
        return Promise.resolve({
            title: "mycollection Configuration",
            value: getConfigUrl(context)
        });
    }

    public async onSettings(context: TurnContext): Promise<void> {
        // take care of the setting returned from the dialog, with the value stored in state
        const setting = context.activity.value.state;
        log(`New setting: ${setting}`);
        return Promise.resolve();
    }

}
