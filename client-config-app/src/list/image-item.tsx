import React, { createRef } from "react";
import { Image, Label, Button, Spinner } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { Sticker, StickerStatus } from "../model/sticker";
import { useImageListStyles } from "./image-list.styles";
import { Delete16Filled, Edit16Regular } from "@fluentui/react-icons";

const ImageItem: React.FC<
    Sticker & {
        onDelete: () => void;
        onEdit: (name:string) => void;
    }
> = (props) => {
    const { src, id, name, status, progress, onEdit, onDelete } = props;
    const { t } = useTranslation();
    const imageListStyles = useImageListStyles();
    const refInput = createRef<HTMLInputElement>();
    const isDeleting = status === StickerStatus.delete;
    const isEditting = status === StickerStatus.editing;
    const isMoving = status === StickerStatus.moving;
    // let state: StatusProps["state"] = undefined;
    let icon = "accept";
    let state = "";

    switch (status) {
        case StickerStatus.delete_fail:
        case StickerStatus.edit_fail:
        case StickerStatus.upload_fail:
            state = "error";
            icon = "error";
            break;
        case StickerStatus.success:
            state = "success";
            icon = "accept";
            break;
        case StickerStatus.moving:
        case StickerStatus.uploading:
        case StickerStatus.upload:
            icon = "loading";
            break;
        case StickerStatus.delete:
        case StickerStatus.editing:
            state = "warning";
            break;
        default:
            if (status) {
                state = "unknown";
            }
    }

    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={src} />
            <Button
                className={imageListStyles.edit}
                icon={<Edit16Regular />}
                size='medium'
                disabled={isDeleting || isMoving}
                appearance='transparent'
                onClick={name ? (() => onEdit(name)) : () =>{}}
            />
            <Button
                className={imageListStyles.close}
                icon={<Delete16Filled />}
                size='medium'
                disabled={isDeleting || isMoving}
                appearance='transparent'
                onClick={onDelete}
            />
            <div className={imageListStyles.bar}>
                <>
                    {icon === "loading" ? (
                        <Spinner size="small" label={progress + "%"} labelPosition="after" />
                    ) : (
                        <></>
                        // state && <Status state={state} icon={icon} size="largest" />
                    )}
                    {icon !== "loading" && name && <Label color="gray">{name}</Label>}
                </>
            </div>
            {/* <Dialog
                cancelButton={{
                    icon: "close",
                    iconOnly: true,
                    circular: true,
                }}
                confirmButton={{
                    icon: "accept",
                    iconOnly: true,
                    circular: true,
                }}
                onConfirm={() => {
                    const value = refInput.current && refInput.current.value;
                    if (value && value !== name) {
                        onEdit(value);
                    }
                }}
                closeOnOutsideClick={false}
                content={
                    <Input
                        inputRef={refInput}
                        clearable
                        maxLength={64}
                        fluid
                        autoFocus
                        placeholder={t(ConfigPage.inputePlaceholder)}
                        defaultValue={name || ""}
                    />
                }
                header={t(ConfigPage.inputeTitle)}
                trigger={
                    <Button
                        className="ImageItem-edit"
                        loading={isEditting}
                        disabled={isEditting || isDeleting || isMoving || status === StickerStatus.uploading}
                        icon="edit"
                        size="small"
                        iconOnly
                        circular
                        secondary
                    />
                }
            /> */}
        </div>
    );
};

export default ImageItem;
