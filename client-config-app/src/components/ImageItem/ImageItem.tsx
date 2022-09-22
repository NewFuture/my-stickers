import React, { ChangeEvent } from "react";
import { Image, Button, Input, InputOnChangeData } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { Delete16Regular } from "@fluentui/react-icons";
import { useImageItemStyles } from "./ImageItem.styles";

const ImageItem: React.FC<
    Sticker & {
        onDelete?: () => void;
        onEdit?: (name: string) => void;
    }
> = (props) => {
    const { src, name, status, onEdit, onDelete } = props;
    const imageListStyles = useImageItemStyles();
    const isDeleting = status === StickerStatus.delete;
    const isMoving = status === StickerStatus.moving;
    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={src} />
            {onDelete && (
                <Button
                    className={imageListStyles.close}
                    icon={<Delete16Regular />}
                    size="medium"
                    disabled={isDeleting || isMoving}
                    appearance="transparent"
                    onClick={onDelete}
                />
            )}
            <div className={imageListStyles.bar}>
                <Input
                    className={imageListStyles.input}
                    appearance="underline"
                    size="medium"
                    defaultValue={name}
                    onChange={(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
                        if (onEdit && data && data.value !== name) {
                            onEdit(data.value);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ImageItem;
