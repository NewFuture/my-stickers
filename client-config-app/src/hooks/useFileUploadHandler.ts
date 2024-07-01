import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_NUM, MAX_SIZE } from "../common/env";
import { TransKeys } from "../locales";

let weight = Date.now() - +new Date("2019-11-20 11:00:00Z");

function getWeight() {
    return (weight += 1000);
}

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
                newFiles.forEach((f) => {
                    f.weight = getWeight();
                });
                setFiles((fList) => [...fList, ...newFiles]);
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
