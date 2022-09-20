import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { ConfigPage, NS } from "../locales";
import { useTranslation } from "react-i18next";
import { useImageListStyles } from "./image-list.styles";
import { UploadImageList } from "./UploadImageList";

export interface UploadButtonProps {
    // multiple?: boolean;
    // disabled?: boolean;
    // picCount: number;
}

interface Msg {
    key: number;
    content: string;
}
const MAX_NUM = 100;
const MAX_SIZE = 1000 * 1024;

export const UploadButton: React.FC<PropsWithChildren<UploadButtonProps>> = (props): JSX.Element => {
    const picCount = 0;
    const [messages, setMessages] = useState([] as Msg[]);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
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
        if (filtered.length) {
            setUploadFiles(filtered.slice(0, MAX_NUM - picCount));
        }
    }

    return (
        <>
            <div className={imageListStyles.item}>
                <label htmlFor="image-upload">
                    {" "}
                    <AddRegular className={imageListStyles.img} />{" "}
                </label>
            </div>
            <UploadImageList files={uploadFiles} />
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
