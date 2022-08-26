import React, { ChangeEvent, useState } from "react";
import { Button, Alert } from "@stardust-ui/react";
import { useSelector } from "react-redux";
import { StateType } from "../../store";
import { uploadStickers } from "../../services/stickers";
import { useTranslation } from "react-i18next";
import { NS, ConfigPage } from "../../locales";

export interface PropType {
    multiple?: boolean;
    disabled?: boolean;
    // onChange: ChangeEventHandler<HTMLInputElement>;
}

interface Msg {
    key: number;
    content: string;
}
const MAX_NUM = 100;
const MAX_SIZE = 1000 * 1024;

const UploadButton: React.FC<PropType> = (props) => {
    const [messages, setMessages] = useState([] as Msg[]);
    const { t } = useTranslation(NS.configPage);

    const n = useSelector((state: StateType) => state.stickers.length);
    const disabled = props.disabled || n >= MAX_NUM;

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
        if (filtered.length + n > MAX_NUM) {
            msg.push({
                key: Math.random(),
                content: t(ConfigPage.maxnum, { n: MAX_NUM }),
            });
        }
        console.log(msg);
        setMessages(msg);
        if (filtered.length) {
            uploadStickers(filtered.slice(0, MAX_NUM - n));
        }
    }

    return (
        <>
            <Button as="label" disabled={disabled} htmlFor="image-upload" icon="add" primary content={props.children} />
            <input
                hidden
                disabled={disabled}
                type="file"
                id="image-upload"
                onChange={ImageUploadHandler}
                multiple={!!props.multiple}
                accept="image/png, image/jpeg, image/gif"
            />
            {messages.map((m) => (
                <Alert style={{ position: "fixed", top: "1em", zIndex: 10 }} icon="error" warning dismissible {...m} />
            ))}
        </>
    );
};

export default UploadButton;
