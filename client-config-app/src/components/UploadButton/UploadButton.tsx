import React from "react";
import { mergeClasses } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";

import { useUploadButtonStyles } from "./UploadButton.styles";

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
    return (
        <div className={mergeClasses(styles.root, className)}>
            <label htmlFor="image-upload">
                <AddRegular className={styles.icon} />
            </label>
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
