import * as debug from "debug";
import { CardFactory, MessagingExtensionQuery, MessagingExtensionResult, MessagingExtensionAttachment, MessagingExtensionSuggestedAction, MessagingExtensionParameter, MessagingExtensionQueryOptions } from "botbuilder";
import { Request } from "express";
import { Sticker, getUserStickers, searchUserStickers } from "../services/sticker";
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
        version: "1.2",
        body: [{
            url: sticker.src,
            altText: sticker.name,
            type: "Image",
            spacing: "None",
            horizontalAlignment: "center",
            msTeams: {
                allowExpand: true
            }
        }]
    });
    card.preview = CardFactory.thumbnailCard(sticker.name || "", [sticker.src]);
    return card;
}

function getConfig(req: Request): MessagingExtensionResult {
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
                value: getConfigUrl(req.userId)
            }]
        } as MessagingExtensionSuggestedAction,
    };
}

/**
 * 分页
 * @param data 
 * @param options 
 */
function pagination(data: Sticker[], options?: MessagingExtensionQueryOptions): MessagingExtensionResult {
    const stickers = options ? data.slice(options.skip || 0, options.count && ((options.skip || 0) + options.count)) : data;
    return {
        type: "result",
        attachmentLayout: "grid",
        attachments: stickers.map(stickerToCard)
    }
}

/**
 * 获取查询参数
 * @param name 
 * @param params 
 */
function getQueryParameters(name: string, params?: MessagingExtensionParameter[]) {
    return params && params.find(p => p.name === name)?.value;
}


/**
 * 表情选择款弹出或者搜索
 * @param context
 * @param query
 */
export async function queryMyCollection(req: Request, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
    const id = req.userId;
    log("onQuery", id, query);
    const search = getQueryParameters("query", query.parameters);
    if (search) {
        const stickers = await searchUserStickers(id, search);
        return pagination(stickers, query.queryOptions);
    } else {
        const stickers = await getUserStickers(id);
        if (stickers && stickers.length) {
            return pagination(stickers, query.queryOptions);
        } else {
            return getConfig(req);
        }
    }
}
