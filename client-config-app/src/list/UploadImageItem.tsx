import React, { useState } from "react";
import { Image } from "@fluentui/react-components";
import { Sticker } from "../model/sticker";
import { useImageListStyles } from "./image-list.styles";
import { uploadSticker1 } from "../services/stickers";

interface UploadImageItemProps {
    file: File;
}

export const UploadImageItem: React.FC<UploadImageItemProps> = ({ file }: UploadImageItemProps): JSX.Element => {
    const imageListStyles = useImageListStyles();
    const [sticker, setSticker] = useState<Sticker>({
        id: `${Math.random()}`,
        src: URL.createObjectURL(file),
        name: file.name.replace(/\..*$/, ""),
    });

    uploadSticker1(file, sticker, setSticker);

    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={sticker.src} />
            <div className={imageListStyles.bar}></div>
        </div>
    );
};
