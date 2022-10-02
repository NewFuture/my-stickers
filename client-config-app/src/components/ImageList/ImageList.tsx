import React, { useState } from "react";
import ImageItem from "../ImageItem/ImageItem";
import { Sticker, StickerStatus } from "../../model/sticker";
import { UploadButton } from "../UploadButton/UploadButton";

import { useImageListStyles } from "./ImageList.styles";
import { UploadImageItem } from "../ImageItem/UploadImageItem";
import { MAX_NUM } from "../../lib/env";
import { MutatorOptions } from "swr";

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
    onMutate: (updateCallback: (items?: Sticker[]) => Sticker[], options?: MutatorOptions) => void;
    onDelete: (id: string) => Promise<any>;
    onPatch: (id: string, data: Partial<Sticker>) => Promise<any>;
    onUpload: (file: File, onProgressUpdate: (percent: number) => void) => Promise<any>;
}

const ImageList: React.FC<ImageListProps> = ({
    isEditable,
    items,
    onMutate,
    onPatch,
    onDelete,
    onUpload,
}: ImageListProps) => {
    const imageListStyles = useImageListStyles();
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const onFinshUpload = (file: File, sticker?: Sticker) => {
        setUploadFiles(uploadFiles.filter((f) => file !== f));
        if (sticker) {
            // 插入新表情
            onMutate((items) => [sticker, ...(items || [])]);
        }
    };

    const maxUploadCount = MAX_NUM - items?.length ?? 0 - uploadFiles.length;
    return (
        <div className={imageListStyles.grid}>
            {isEditable && <UploadButton onUploadListChange={setUploadFiles} maxNum={maxUploadCount} />}
            {uploadFiles?.map((item: File, index) => (
                <UploadImageItem key={index} file={item} onFinish={onFinshUpload} onUpload={onUpload} />
            ))}
            {items?.map((item: Sticker) => (
                <ImageItem
                    isEditable
                    key={item.id}
                    {...item}
                    onDelete={
                        isEditable
                            ? () => {
                                  onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.delete }), {
                                      revalidate: false,
                                  });
                                  onDelete(item.id).then(
                                      // 删除成功
                                      () => onMutate((list) => list?.filter((v) => v.id !== item.id)!),
                                      // 删除失败
                                      () =>
                                          onMutate(
                                              getPatchItemByIdFunc(item.id, { status: StickerStatus.delete_fail }),
                                          ),
                                  );
                              }
                            : undefined
                    }
                    onEdit={(name: string) => {
                        onMutate(getPatchItemByIdFunc(item.id, { name, status: StickerStatus.editing }), {
                            revalidate: false,
                        });
                        onPatch(item.id, { name }).then(
                            () =>
                                onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.success }), {
                                    revalidate: false,
                                }),
                            () => onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.edit_fail })),
                        );
                    }}
                />
            ))}
        </div>
    );
};

export default ImageList;
