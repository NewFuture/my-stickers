import React, { SyntheticEvent } from "react";
import { MutatorOptions } from "swr";

import ImageItem from "../ImageItem/ImageItem";
import { Sticker, StickerStatus } from "../../model/sticker";
import { UploadButton } from "../UploadButton/UploadButton";
import { useImageListStyles } from "./ImageList.styles";
import { UploadImageItem } from "../ImageItem/UploadImageItem";
import { MAX_NUM } from "../../common/env";
import { useFileUploadHandler } from "../../hooks/useFileUploadHandler";
import { Alert } from "../Alert/Alert";
import { isIdle } from "../../services/stickers";

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

function dragOverHandler(ev: SyntheticEvent) {
    ev.preventDefault();
    ev.stopPropagation();
}

function compareOrder(a: Sticker, b: Sticker) {
    return b.weight! - a.weight!;
}

let timer: number;
function doAfter(callback: () => any, delay: number) {
    clearTimeout(timer);
    timer = window.setTimeout(callback, delay);
}
interface ImageListProps {
    items: Sticker[];
    enableEdit: boolean;
    enableUpload: boolean;
    onMutate: (updateCallback: (items?: Sticker[]) => Sticker[], options?: MutatorOptions) => void;
    onDelete: (sticker: Sticker) => Promise<any>;
    onPatch: (id: string, data: Partial<Sticker>) => Promise<any>;
    onUpload: (file: File, onProgressUpdate: (percent: number) => void) => Promise<any>;
}

const ImageList: React.FC<ImageListProps> = ({
    enableEdit,
    enableUpload,
    items,
    onMutate,
    onPatch,
    onDelete,
    onUpload,
}: ImageListProps) => {
    const styles = useImageListStyles();
    const { files, errors, uploadHandler, removeFile, enable } = useFileUploadHandler(MAX_NUM - items?.length ?? 0);
    const onFinshUpload = (file: File, sticker?: Sticker) => {
        removeFile(file);
        if (sticker) {
            // 插入新表情
            onMutate((items) => [sticker, ...(items || [])].sort(compareOrder), { revalidate: false });
            if (isIdle()) {
                doAfter(() => isIdle() && onMutate((l) => l!), 1800);
            }
        }
    };
    return (
        <>
            <div
                className={styles.grid}
                onDrop={
                    enable
                        ? (ev) => {
                              if (ev.dataTransfer.items?.length) {
                                  uploadHandler(Array.from(ev.dataTransfer.files));
                                  ev.preventDefault();
                                  ev.stopPropagation();
                              }
                          }
                        : undefined
                }
                onDragOver={dragOverHandler}
            >
                {enableUpload && (
                    <UploadButton className={styles.item} onUploadChangeHandler={uploadHandler} disabled={!enable} />
                )}
                {files?.map((item: File, index) => (
                    <UploadImageItem
                        key={`#${item.lastModified}#${item.webkitRelativePath || item.name}#${item.size}`}
                        className={styles.item}
                        file={item}
                        onFinish={onFinshUpload}
                        onUpload={onUpload}
                        order={-1 - index}
                    />
                ))}
                {items?.map((item: Sticker, index) => (
                    <ImageItem
                        className={styles.item}
                        isEditable
                        lazy={index > 14}
                        key={item.id}
                        {...item}
                        onDelete={
                            enableEdit
                                ? () => {
                                      onMutate(getPatchItemByIdFunc(item.id, { status: StickerStatus.delete }), {
                                          revalidate: false,
                                      });
                                      onDelete(item).then(
                                          // 删除成功
                                          () =>
                                              onMutate((list) => list?.filter((v) => v.id !== item.id)!, {
                                                  revalidate: false,
                                              }),
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
            <div className={styles.errors}>
                {errors.map((m) => (
                    <Alert key={m.key}>{m.content}</Alert>
                ))}
            </div>
        </>
    );
};

export default ImageList;
