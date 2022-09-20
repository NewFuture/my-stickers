import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { Button } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import { uploadStickers } from "../services/stickers";
import { ConfigPage, NS } from "../locales";
import { useTranslation } from "react-i18next";
import "./item.scss";

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
    // const { disabled,picCount,multiple } = props;
    const picCount = 0;
    const [, setMessages] = useState([] as Msg[]);
    const { t } = useTranslation(NS.configPage);

    const inputDisabled = picCount >= MAX_NUM;

    /**
     * @todo 限制文件大小
     * @param e
     */
    function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const msg = [];
        const files: File[] = [...(e.target.files as any)];
        const filtered = files.filter((v) => v.size < MAX_SIZE);
        console.log(filtered, files.length, filtered.length);
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
        console.log(msg);
        setMessages(msg);
        if (filtered.length) {
            uploadStickers(filtered.slice(0, MAX_NUM - picCount));
        }
    }

    const fileUploadRef = React.useRef<HTMLInputElement>(null);
    const handleClick = () => {
        fileUploadRef?.current?.click();
    };
    return (
        <>
            <div className="ImageItem">
                <Button icon={<AddRegular />} onClick={handleClick} />
            </div>
            <input
                hidden
                disabled={inputDisabled}
                type="file"
                id="image-upload"
                onChange={ImageUploadHandler}
                multiple
                ref={fileUploadRef}
                accept="image/png, image/jpeg, image/gif"
            />
        </>
    );
};
