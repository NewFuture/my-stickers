import React, { useEffect, useState } from "react";
import { Image, Label, PresenceBadge } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { ArrowRepeatAll16Regular } from "@fluentui/react-icons";
import { useImageItemStyles } from "./ImageItem.styles";

interface UploadImageItemProps {
    file: File;
    onDelete: (file: File) => void;
    onUpload: (file: File, onProgressUpdate: (percent: number) => void) => Promise<any>;
}

export const UploadImageItem: React.FC<UploadImageItemProps> = ({
    file,
    onDelete,
    onUpload,
}: UploadImageItemProps): JSX.Element => {
    const imageListStyles = useImageItemStyles();
    const [sticker, setSticker] = useState<Sticker>(() => ({
        id: `${Math.random()}`,
        src: URL.createObjectURL(file),
        name: file.name.replace(/\..*$/, ""),
    }));

    useEffect((): void => {
        onUpload(file, (progress) => setSticker((s) => ({ ...s, progress }))).then(
            (data) => {
                setSticker((s) => ({ ...s, status: StickerStatus.success, progress: undefined }));
            },
            (err) => {
                // error message
                setSticker((s) => ({ ...s, status: StickerStatus.upload_fail, progress: undefined }));
            },
        );
    }, [file, onUpload]);

    const status =
        sticker.status === StickerStatus.success
            ? "available"
            : sticker.status === StickerStatus.upload_fail
            ? "offline"
            : undefined;
    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={sticker.src} />
            <div className={imageListStyles.uploadingBar}>
                {status && <PresenceBadge size="large" status={status} className={imageListStyles.icon} />}
                {sticker.progress && (
                    <progress value={sticker.progress} max="100">
                        <ArrowRepeatAll16Regular className={imageListStyles.icon} />
                        <Label>{sticker.progress}%</Label>
                    </progress>
                )}
            </div>
        </div>
    );
};
