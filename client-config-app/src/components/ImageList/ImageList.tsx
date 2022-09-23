import React, { useState } from "react";
import ImageItem from "../ImageItem/ImageItem";
import { Sticker } from "../../model/sticker";
import { deleteSticker, editSticker } from "../../services/stickers";
import { UploadButton } from "../UploadButton/UploadButton";

import { useImageListStyles } from "./ImageList.styles";
import { useSWRConfig } from "swr";
import { UploadImageItem } from "../ImageItem/UploadImageItem";
import { MAX_NUM } from "../../lib/env";

interface ImageListProps {
    items: Sticker[];
    isTenant: boolean;
}

const ImageList: React.FC<ImageListProps> = ({ isTenant }: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    const { cache, mutate } = useSWRConfig();
    const stickers = cache.get("stickers")?.values;
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const onFinshUpload = (file: File) => {
        setUploadFiles(uploadFiles.filter((f) => file !== f));
        mutate("stickers");
    };

    const maxUploadCount = MAX_NUM - stickers?.length ?? 0 - uploadFiles.length;
    return (
        <div className={imageListStyles.grid}>
            {!isTenant && <UploadButton onUploadListChange={setUploadFiles} maxNum={maxUploadCount} />}
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
                    onEdit={(name: string) => {
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
