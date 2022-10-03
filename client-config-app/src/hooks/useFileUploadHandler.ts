import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_NUM } from "../lib/env";
import { TransKeys } from "../locales";

const MAX_SIZE = 1000 * 1024;

interface ErrMsg {
    key: number;
    content: string;
}
export function useFileUploadHandler(maxNum: number, setFiles: (callback: (files: File[]) => File[]) => any) {
    const [errMessages, setMessages] = useState<ErrMsg[]>([]);
    const { t } = useTranslation();
    const uploadHandler = useCallback(
        (files: File[]) => {
            const msg = [];
            const imageFiles = files.filter(({ type }) => !type || type.startsWith("image"));

            if (imageFiles.length !== files.length) {
                msg.push({
                    key: Math.random(),
                    content: t(TransKeys.filetype),
                });
            }
            const filtered = files.filter(({ size, type }) => size < MAX_SIZE && (!type || type.startsWith("image")));
            if (filtered.length !== imageFiles.length) {
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
            if (filtered.length) {
                const newFiles = filtered.slice(0, maxNum);
                setFiles((fList) => fList.concat(newFiles));
            }
        },
        [t, maxNum, setFiles],
    );
    return {
        errMessages,
        uploadHandler,
    };
}
