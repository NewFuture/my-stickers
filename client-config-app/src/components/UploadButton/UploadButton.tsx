import React, { ChangeEvent, useCallback, useState } from "react";
import { AddRegular } from "@fluentui/react-icons";
import { TransKeys } from "../../locales";
import { useTranslation } from "react-i18next";
import { useUploadButtonStyles } from "./UploadButton.styles";
import { MAX_NUM } from "../../lib/env";

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
    const imageListStyles = useUploadButtonStyles();
    const inputDisabled = picCount >= maxNum;

    const imageUploadHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
    }, []);

    return (
        <div className={imageListStyles.root}>
            <label htmlFor="image-upload">
                <AddRegular className={imageListStyles.icon} />
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
    );
};
