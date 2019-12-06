import * as debug from "debug";
import { CardFactory, CardImage, MessagingExtensionAttachment, TaskModuleResponse, MessagingExtensionAction, MessageActionsPayloadAttachment, TaskModuleContinueResponse } from "botbuilder";
import { Request } from "express";
import { addUserStickers } from "../services/sticker";
import { Locale } from "../config/";

// Initialize debug logging module
const log = debug("collect");

const ImgSrcRegex = /<img[^>]+src="([^"\s]+)"[^>]*>/g;
const ImgAltRegex = /<img[^>]+alt="([^"]+)"[^>]*>/;
interface Img { src: string; alt?: string | null; }
// 字符串中提取图片信息
function getImages(text: string): Img[] {
    const urls: Img[] = [];
    let m = ImgSrcRegex.exec(text);
    while (m) {
        const alt = m[0].match(ImgAltRegex);
        urls.push({ src: m[1], alt: alt && alt[1] });
        m = ImgSrcRegex.exec(text);
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
    if (a.contentType === "application/vnd.microsoft.card.adaptive" || a.contentType === "application/vnd.microsoft.card.hero") {
        const card: any = typeof a.content === "string" ? JSON.parse(a.content || "{\"body\":[]}") : a.content;
        return card.body.filter(c => c.type === "Image").map((c) => ({ src: c.url, alt: c.alt || c.altText }));
    }
    return [];
}

export async function fetchTaskCollect(req: Request, value: MessagingExtensionAction): Promise<TaskModuleResponse> {
    const id = req.userId;
    log("onFetchTask", id);
    const payload = value.messagePayload || {};
    const imgs = getImages(payload.body!.content!);
    const attachments: MessageActionsPayloadAttachment[] = payload.attachments || [];
    attachments.map(getImageFromAttachment).filter(s => !!s).forEach(s => imgs.push(...s));

    log("imgs", imgs);
    const hasImgs = imgs && imgs.length > 0;

    const saveImgs = hasImgs && await addUserStickers(id, imgs.map(img => ({ src: img.src, name: img.alt! })));
    // log('imgs', saveImgs)


    const card = CardFactory.adaptiveCard(
        {
            type: "AdaptiveCard",
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            version: "1.0",
            body: saveImgs ? [
                ...saveImgs.map<CardImage>(img => ({
                    url: img.src,
                    type: "Image",
                    altText: img.name,
                    spacing: "None",
                }))
            ] : [
                    {
                        type: "TextBlock",
                        text: req.__(Locale.collect_save_no_images_found),
                        horizontalAlignment: "Center",
                        wrap: true,
                    }
                ],
            // actions: [
            //     // {
            //     //     type: "Action.Submit",
            //     //     title: "删除",
            //     //     data: {
            //     //         action: "moreDetails",
            //     //         id: "1234-5678"
            //     //     }
            //     // },
            //     // {
            //     //     type: "Action.Submit",
            //     //     title: "确定",
            //     //     data: {
            //     //         id: "1234-5678"
            //     //     }
            //     // },
            // ],
        });
    const result: TaskModuleContinueResponse = {
        type: "continue",
        value: {
            title: req.__(saveImgs ? Locale.collect_save_success : Locale.collect_save_fail),
            height: "small",
            width: "small",
            card,
        }
    };
    return Promise.resolve({
        task: result,
    });
}
