import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_NUM } from "../common/env";
import { TransKeys } from "../locales";

const MAX_SIZE = 1000 * 1024;

interface ErrMsg {
    key: number;
    content: string;
}
export function useFileUploadHandler(maxNum: number) {
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<ErrMsg[]>([]);
    const { t } = useTranslation();
    const remaining = maxNum - files.length;
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
            if (filtered.length > remaining) {
                msg.push({
                    key: Math.random(),
                    content: t(TransKeys.maxnum, { count: MAX_NUM }),
                });
            }
            setErrors(msg);
            if (filtered.length) {
                const newFiles = filtered.slice(0, remaining);
                setFiles((fList) => newFiles.reverse().concat(fList));
            }
        },
        [t, remaining],
    );
    return {
        files,
        errors,
        uploadHandler,
        enable: remaining > 0,
        removeFile: useCallback((file: File) => setFiles((fileList) => fileList.filter((f) => f !== file)), []),
    };
}
