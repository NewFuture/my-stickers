import React from "react";
import { Image, Label, Button, Spinner } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../model/sticker";
import { useImageListStyles } from "./image-list.styles";
import { Delete16Filled, Edit16Regular } from "@fluentui/react-icons";

const ImageItem: React.FC<
    Sticker & {
        onDelete?: () => void;
        onEdit?: (name: string) => void;
    }
> = (props) => {
    const { src, name, status, progress, onEdit, onDelete } = props;
    const imageListStyles = useImageListStyles();
    const isDeleting = status === StickerStatus.delete;
    const isMoving = status === StickerStatus.moving;
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

    console.log(state);
    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={src} />
            {onEdit && (
                <Button
                    className={imageListStyles.edit}
                    icon={<Edit16Regular />}
                    size="medium"
                    disabled={isDeleting || isMoving}
                    appearance="transparent"
                    onClick={name ? () => onEdit(name) : () => {}}
                />
            )}
            {onDelete && (
                <Button
                    className={imageListStyles.close}
                    icon={<Delete16Filled />}
                    size="medium"
                    disabled={isDeleting || isMoving}
                    appearance="transparent"
                    onClick={onDelete}
                />
            )}
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
        </div>
    );
};

export default ImageItem;
