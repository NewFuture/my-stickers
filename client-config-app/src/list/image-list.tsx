import React, { useState } from "react";
import ImageItem from "./image-item";
import { Sticker } from "../model/sticker";
import { deleteSticker, editSticker } from "../services/stickers";
import { UploadButton } from "./UploadButton";

import { useImageListStyles } from "./image-list.styles";
import { useSWRConfig } from "swr";
import { UploadImageItem } from "./UploadImageItem";
interface ImageListProps {
    items: Sticker[];
}

const ImageList: React.FC<ImageListProps> = (props: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    const { cache, mutate } = useSWRConfig();
    const stickers = cache.get("stickers")?.values;
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const onFinshUpload = (file: File) => {
        setUploadFiles(uploadFiles.filter((f) => file !== f));
        mutate("stickers");
    };
    return (
        <div className={imageListStyles.grid}>
            <UploadButton onUploadListChange={setUploadFiles} />
            {uploadFiles?.map((item: File, index) => (
                <UploadImageItem key={index} file={item} onFinsh={onFinshUpload} />
            ))}
            {stickers?.map((item: Sticker) => (
                <ImageItem
                    key={item.id}
                    {...item}
                    onDelete={() =>
                        deleteSticker(item.id).then(() => {
                            mutate("stickers");
                        })
                    }
                    onEdit={(name) => {
                        editSticker(item.id, name).then(() => {
                            mutate("stickers");
                        });
                    }}
                />
            ))}
        </div>
    );
};

export default ImageList;
