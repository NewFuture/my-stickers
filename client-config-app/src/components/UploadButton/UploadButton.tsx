import React, { ChangeEvent, useState } from "react";
import { AddRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";

import { useUploadButtonStyles } from "./UploadButton.styles";
import { MAX_NUM } from "../../lib/env";
import { Alert } from "../Alert/Alert";

export interface UploadButtonProps {
    onUploadListChange: (file: File[]) => void;
    maxNum: number;
}

interface Msg {
    key: number;
    content: string;
}

const MAX_SIZE = 1000 * 1024;

/**
 * todo pass maxNum

 * @returns
 */
export const UploadButton: React.FC<UploadButtonProps> = ({ maxNum, onUploadListChange }): JSX.Element => {
    const picCount = 0;
    const [messages, setMessages] = useState<Msg[]>([]);
    const { t } = useTranslation();
    const styles = useUploadButtonStyles();
    const inputDisabled = picCount >= maxNum;

    const imageUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const msg = [];
        const files: File[] = [...(e.target.files as any)];
        const filtered = files.filter((v) => v.size < MAX_SIZE);
        if (filtered.length !== files.length) {
            msg.push({
                key: Math.random(),
                content: t(TransKeys.maxsize, { size: MAX_SIZE / 1024 + "K" }),
            });
        }
        if (filtered.length > maxNum) {
            msg.push({
                key: Math.random(),
                content: t(TransKeys.maxnum, { n: MAX_NUM }),
            });
        }
        setMessages(msg);
        console.log(messages);
        if (filtered.length) {
            onUploadListChange(filtered.slice(0, MAX_NUM - picCount));
        }
    };

    return (
        <>
            <div className={styles.root}>
                <label htmlFor="image-upload">
                    <AddRegular className={styles.icon} />
                </label>
                <input
                    hidden
                    disabled={inputDisabled}
                    type="file"
                    id="image-upload"
                    onChange={imageUploadHandler}
                    multiple
                    accept="image/png, image/jpeg, image/gif"
                />
            </div>
            <div className={styles.errors}>
                {messages.map((m) => (
                    <Alert key={m.key}>{m.content}</Alert>
                ))}
            </div>
        </>
    );
};
