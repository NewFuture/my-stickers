import React from "react";
import ImageItem from "./image-item";
import { Sticker } from "../model/sticker";
import { deleteSticker, editSticker } from "../services/stickers";
import { UploadButton } from "./UploadButton";

import { useImageListStyles } from "./image-list.styles";
interface ImageListProps {
    items: Sticker[];
}

const ImageList: React.FC<ImageListProps> = (props: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    return (
        <div className={imageListStyles.grid}>
            <UploadButton />
            {props.items.map((item) => (
                <ImageItem
                    key={item.id}
                    {...item}
                    onDelete={() => deleteSticker(item.id)}
                    onEdit={(name) => {
                        editSticker(item.id, name);
                    }}
                />
            ))}
        </div>
    );
};

export default ImageList;
