import React from "react";
import ImageItem from "./image-item";
import { Sticker } from "../model/sticker";
import { deleteSticker, editSticker } from "../services/stickers";
import { UploadButton } from "./UploadButton";

import { useImageListStyles } from "./image-list.styles";
import { useSWRConfig } from "swr";
interface ImageListProps {
    items: Sticker[];
}

const ImageList: React.FC<ImageListProps> = (props: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    const { cache, mutate } = useSWRConfig();
    const stickers = cache.get("stickers")?.values;
    return (
        <div className={imageListStyles.grid}>
            <UploadButton />
            {stickers.map((item: Sticker) => (
                <ImageItem
                    key={item.id}
                    {...item}
                    onDelete={() =>
                        deleteSticker(item.id).then(() => {
                            mutate("stickers");
                            // const indexOfObject = stickers.findIndex((element:Sticker) => {
                            //     return element.id === item.id;
                            //   });
                            //   if (indexOfObject !== -1) {
                            //     stickers.splice(indexOfObject, 1);
                            //   }
                            //   cache.set('stickers',{'values':stickers});

                            //   const stickers1 = cache.get('stickers');

                            //   console.log('stickers',stickers1);
                        })
                    }
                    onEdit={(name) => {
                        editSticker(item.id, name);
                    }}
                />
            ))}
        </div>
    );
};

export default ImageList;
