import * as debug from "debug";
import { CardFactory, MessagingExtensionQuery, MessagingExtensionResult, MessagingExtensionAttachment, MessagingExtensionSuggestedAction } from "botbuilder";
import { Request } from "express";
import { Sticker, getUserStickers } from "../services/sticker";
import { getConfigUrl } from "./getConfigUrl";
import { Locale } from "../config";

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
export async function queryMyCollection(req: Request, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
    const id = req.userId;
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
            text: req.__(Locale.initial_run_upload_stickers),
            suggestedActions: {
                actions: [{
                    type: "openUrl",
                    title: req.__(Locale.initial_run_upload_stickers),
                    // image: "https://cataas.com/cat/gif",
                    // text: "UPLOAD",
                    // displayText: "上传",
                    value: getConfigUrl(id)
                }]
            } as MessagingExtensionSuggestedAction,
        };
    }
}
