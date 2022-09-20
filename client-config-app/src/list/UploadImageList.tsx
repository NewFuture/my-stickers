import React from "react";
import { UploadImageItem } from "./UploadImageItem";

interface UploadImageListProps {
    files: File[];
}

export const UploadImageList: React.FC<UploadImageListProps> = ({ files }: UploadImageListProps): JSX.Element => {
    return (
        <>
            {files.map((item: File) => (
                <UploadImageItem file={item} />
            ))}
        </>
    );
};
