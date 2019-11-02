import { TurnContext, CardFactory, CardImage } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor, IMessagingExtensionActionRequest, ITaskModuleResult } from "botbuilder-teams-messagingextensions";
import { MessagingExtensionResult, TeamsAttachment, MessagingExtensionAttachment } from "botbuilder-teams";

import * as debug from "debug";
import { addUserStickers } from "../services/sticker";
import { getUserId } from "../util";

// Initialize debug logging module
const log = debug("msteams");

interface Img { src: string; alt?: string; }
// 字符串中提取图片信息
function getImages(text: string): Img[] {
    const urls: Img[] = [];
    const rex = /<img[^>]+src="([^"\s]+)"[^>]*>/g;
    let m = rex.exec(text);
    while (m) {
        urls.push({ src: m[1] });
        m = rex.exec(text);
    }
    return urls;
}

// 附件中提取图片
function getImageFromAttachment(a: MessagingExtensionAttachment): Img[] {
    const imageReg = /^http(s?):\/\/.*\.(?:jpg|gif|png)$/;
    if (a.contentType.startsWith("image") || imageReg.test(a.contentUrl!)) {
        // download attach
        return [{ src: a.contentUrl! }];
    }
    if (a.contentType === "application/vnd.microsoft.card.adaptive" || a.contentType == "application/vnd.microsoft.card.hero") {
        const card: any = typeof a.content === "string" ? JSON.parse(a.content || "{\"body\":[]}") : a.content;
        return card.body.filter(c => c.type === "Image").map((c: CardImage) => ({ src: c.url, alt: c.alt }));
    }
    return [];
}

/**
 * collect stickers from message
 */
export default class CollectMessageExtension implements IMessagingExtensionMiddlewareProcessor {

    /**
     * 点击收藏表情命令
     * @param context 
     * @param value 
     */
    public async onFetchTask(context: TurnContext, value: IMessagingExtensionActionRequest): Promise<ITaskModuleResult> {
        const id = getUserId(context);
        log("onFetchTask", id);
        const imgs = getImages(value.messagePayload.body.content);
        const attachments: MessagingExtensionAttachment[] = value.messagePayload.attachments || [];
        attachments.map(getImageFromAttachment).filter(s => !!s).forEach(s => imgs.push(...s));

        log('imgs', imgs)
        const saveImgs = await addUserStickers(id, imgs.map(img => ({ src: img.src, name: img.alt })))
        // log('imgs', saveImgs)

        const card = CardFactory.adaptiveCard(
            {
                type: "AdaptiveCard",
                body: [
                    ...saveImgs.map(img => ({
                        url: img.src,
                        type: "Image",
                        altText: img.name,
                        spacing: "None",
                    }))
                ],
                actions: [
                    // {
                    //     type: "Action.Submit",
                    //     title: "删除",
                    //     data: {
                    //         action: "moreDetails",
                    //         id: "1234-5678"
                    //     }
                    // },
                    // {
                    //     type: "Action.Submit",
                    //     title: "确定",
                    //     data: {
                    //         id: "1234-5678"
                    //     }
                    // },
                ],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.0"
            });

        const result: ITaskModuleResult = {
            type: "continue",
            value: {
                title: "saved",
                height: "small",
                width: "small",
                card,
            }
        };
        return Promise.resolve(result);
    }

    /**
     * 弹框后的 actions 操作
     * @param context 
     * @param value 
     */
    public async onSubmitAction(context: TurnContext, value: IMessagingExtensionActionRequest): Promise<MessagingExtensionResult> {
        // Handle the Action.Submit action on the adaptive card
        log("onSubmit", value);

        const result: MessagingExtensionResult = {
            type: "message",
            text: "submitted"
        };

        return Promise.resolve(result);
    }

}
