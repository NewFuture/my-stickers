import React, { useState } from "react";
import ImageItem from "../ImageItem/ImageItem";
import { Sticker, StickerStatus } from "../../model/sticker";
import { deleteSticker, editSticker } from "../../services/stickers";
import { UploadButton } from "../UploadButton/UploadButton";

import { useImageListStyles } from "./ImageList.styles";
import { UploadImageItem } from "../ImageItem/UploadImageItem";
import { MAX_NUM } from "../../lib/env";

function getPatchItemByIdFunc(id: string, props: Partial<Sticker>) {
    return (list?: Sticker[]) =>
        list?.map((item) =>
            item.id !== id
                ? item
                : {
                      ...item,
                      ...props,
                  },
        )!;
}
interface ImageListProps {
    items: Sticker[];
    isEditable: boolean;
    onMutate: (updateCallback: (items?: Sticker[]) => Sticker[]) => void;
}

const ImageList: React.FC<ImageListProps> = ({ isEditable, items, onMutate }: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const onFinshUpload = (file: File) => {
        setUploadFiles(uploadFiles.filter((f) => file !== f));
    };

    const maxUploadCount = MAX_NUM - items?.length ?? 0 - uploadFiles.length;
    return (
        <div className={imageListStyles.grid}>
            {!isEditable && <UploadButton onUploadListChange={setUploadFiles} maxNum={maxUploadCount} />}
            {uploadFiles?.map((item: File, index) => (
                <UploadImageItem key={index} file={item} onDelete={onFinshUpload} />
            ))}
            {items?.map((item: Sticker) => (
                <ImageItem
                    isEditable
                    key={item.id}
                    {...item}
                    onDelete={() => {
                        onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.delete }));
                        deleteSticker(item.id).then(
                            // 删除成功
                            () => onMutate((list) => list?.filter((v) => v.id !== item.id)!),
                            // 删除失败
                            () => onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.delete_fail })),
                        );
                    }}
                    onEdit={(name: string) => {
                        onMutate(getPatchItemByIdFunc(item.id, { name, status: StickerStatus.editing }));
                        editSticker(item.id, name).then(
                            () => onMutate(getPatchItemByIdFunc(item.id, { status: undefined })),
                            () => onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.edit_fail })),
                        );
                    }}
                />
            ))}
        </div>
    );
};

export default ImageList;
