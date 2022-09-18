import React from "react";
import ImageItem from "./image-item";
import { Sticker } from "../model/sticker";
import { deleteSticker, editSticker } from "../services/stickers";

interface Props {
    items: Sticker[];
}

const ImageList: React.FC<Props> = (props: Props) => {
    return (
        <div className="just-items-center">
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
