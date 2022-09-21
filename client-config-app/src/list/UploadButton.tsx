import React, { ChangeEvent, useState } from "react";
import { AddRegular } from "@fluentui/react-icons";
import { ConfigPage, NS } from "../locales";
import { useTranslation } from "react-i18next";
import { useImageListStyles } from "./image-list.styles";

export interface UploadButtonProps {
    onUploadListChange: (file: File[]) => void;
}

interface Msg {
    key: number;
    content: string;
}
const MAX_NUM = 100;
const MAX_SIZE = 1000 * 1024;

export const UploadButton: React.FC<UploadButtonProps> = ({ onUploadListChange }: UploadButtonProps): JSX.Element => {
    const picCount = 0;
    const [messages, setMessages] = useState([] as Msg[]);
    const { t } = useTranslation(NS.configPage);
    const imageListStyles = useImageListStyles();
    const inputDisabled = picCount >= MAX_NUM;

    /**
     * @todo 限制文件大小
     * @param e
     */
    function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const msg = [];
        const files: File[] = [...(e.target.files as any)];
        const filtered = files.filter((v) => v.size < MAX_SIZE);
        if (filtered.length !== files.length) {
            // alert("暂不支持超过1M的图片,超过的自动过滤");
            msg.push({
                key: Math.random(),
                content: t(ConfigPage.maxsize, { size: MAX_SIZE / 1024 + "K" }),
            });
        }
        if (filtered.length + picCount > MAX_NUM) {
            msg.push({
                key: Math.random(),
                content: t(ConfigPage.maxnum, { n: MAX_NUM }),
            });
        }
        setMessages(msg);
        console.log(messages);
        if (filtered.length) {
            onUploadListChange(filtered.slice(0, MAX_NUM - picCount));
        }
    }

    return (
        <>
            <div className={imageListStyles.item}>
                <label htmlFor="image-upload">
                    <AddRegular className={imageListStyles.img} />
                </label>
            </div>
            <input
                hidden
                disabled={inputDisabled}
                type="file"
                id="image-upload"
                onChange={ImageUploadHandler}
                multiple
                accept="image/png, image/jpeg, image/gif"
            />
        </>
    );
};
