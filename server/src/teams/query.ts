import * as debug from "debug";
import { TurnContext, CardFactory , MessagingExtensionQuery, MessagingExtensionResult, MessagingExtensionAttachment, MessagingExtensionSuggestedAction } from "botbuilder";
import { Sticker, getUserStickers } from "../services/sticker";
import { getUserId } from "../util";
import { getConfigUrl } from "./getConfigUrl";

// Initialize debug logging module
const log = debug("mycollection");


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
    card.preview = CardFactory.thumbnailCard(sticker.name || "", [sticker.src]);
    return card;
}

/**
 * 表情选择款弹出或者搜索
 * @param context
 * @param query
 */
export async function queryMyCollection(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
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
            };
        }
    }
