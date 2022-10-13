import React from "react";
import { mergeClasses, Tooltip } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";

import { useUploadButtonStyles } from "./UploadButton.styles";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";

export interface UploadButtonProps {
    onUploadChangeHandler: (file: File[]) => void;
    disbaled?: boolean;
    className?: string;
}

/**
 * todo pass maxNum

 * @returns
 */
export const UploadButton: React.FC<UploadButtonProps> = ({
    disbaled,
    onUploadChangeHandler,
    className,
}): JSX.Element => {
    const styles = useUploadButtonStyles();
    const { t } = useTranslation();
    return (
        <div className={mergeClasses(styles.root, className)}>
            <Tooltip content={t(TransKeys.uploadTips)} relationship="label">
                <label htmlFor="image-upload">
                    <AddRegular className={styles.icon} />
                </label>
            </Tooltip>
            <input
                hidden
                disabled={disbaled}
                type="file"
                id="image-upload"
                onChange={(e) => onUploadChangeHandler(Array.from(e.target.files!))}
                multiple
                accept="image/*"
            />
        </div>
    );
};
