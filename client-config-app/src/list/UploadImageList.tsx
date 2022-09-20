import React from "react";
import { useTranslation } from "react-i18next";
import { useImageListStyles } from "./image-list.styles";
import { UploadImageItem } from "./UploadImageItem";

interface UploadImageListProps {
    files: File[];
}

export const UploadImageList: React.FC<UploadImageListProps> = ({ files }: UploadImageListProps): JSX.Element => {
    const { t } = useTranslation();
    const imageListStyles = useImageListStyles();

    return (
        <>
            {files.map((item: File) => (
                <UploadImageItem file={item} />
            ))}
        </>
    );
};
