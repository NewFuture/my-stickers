import { mergeClasses, Tooltip } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";

import { useUploadButtonStyles } from "./UploadButton.styles";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";

export interface UploadButtonProps {
    onUploadChangeHandler: (file: File[]) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * todo pass maxNum

 * @returns
 */
export function UploadButton({ disabled, onUploadChangeHandler, className }: UploadButtonProps) {
    const styles = useUploadButtonStyles();
    const { t } = useTranslation();
    return (
        <div className={mergeClasses(styles.root, className)}>
            <Tooltip content={t(disabled ? TransKeys.uploadDisabled : TransKeys.uploadTips)} relationship="label">
                <label htmlFor="image-upload">
                    <AddRegular
                        className={mergeClasses(styles.icon, disabled ? styles.iconDisabled : styles.iconEnabled)}
                    />
                </label>
            </Tooltip>
            <input
                hidden
                disabled={disabled}
                type="file"
                id="image-upload"
                onChange={(e) => onUploadChangeHandler(Array.from(e.target.files!))}
                multiple
                accept="image/*"
            />
        </div>
    );
}
