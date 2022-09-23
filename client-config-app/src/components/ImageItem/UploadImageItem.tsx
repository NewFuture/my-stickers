import React, { useEffect, useState } from "react";
import { Image, Label } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { uploadSticker } from "../../services/stickers";
import { ArrowRepeatAll16Regular } from "@fluentui/react-icons";
import { useImageItemStyles } from "./ImageItem.styles";

interface UploadImageItemProps {
    file: File;
    onFinsh: (file: File) => void;
}

export const UploadImageItem: React.FC<UploadImageItemProps> = ({
    file,
    onFinsh,
}: UploadImageItemProps): JSX.Element => {
    const imageListStyles = useImageItemStyles();
    const [sticker, setSticker] = useState<Sticker>(() => ({
        id: `${Math.random()}`,
        src: URL.createObjectURL(file),
        name: file.name.replace(/\..*$/, ""),
    }));

    useEffect((): void => {
        uploadSticker(file, (progress) => setSticker((s) => ({ ...s, progress }))).then(
            () => {
                setSticker((s) => ({ ...s, status: StickerStatus.success, progress: undefined }));
                onFinsh(file);
            },
            () => {
                setSticker((s) => ({ ...s, status: StickerStatus.upload_fail, progress: undefined }));
            },
        );
    }, [file, onFinsh]);

    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={sticker.src} />
            {sticker.progress && (
                <div className={imageListStyles.uploadingBar}>
                    <ArrowRepeatAll16Regular className={imageListStyles.icon} />
                    <Label>{sticker.progress}%</Label>
                </div>
            )}
        </div>
    );
};
