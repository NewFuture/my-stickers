import React, { ChangeEvent, useState } from "react";
import { Image, Button, Input, InputOnChangeData } from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { Delete16Regular } from "@fluentui/react-icons";
import { useImageItemStyles } from "./ImageItem.styles";

const ImageItem: React.FC<
    Sticker & {
        isEditable?: boolean;
        onDelete?: () => void;
        onEdit?: (name: string) => void;
    }
> = ({ src, name, status, isEditable, onEdit, onDelete }) => {

    const [currentName, setName] = useState(name);
    const imageListStyles = useImageItemStyles();
    const isDeleting = status === StickerStatus.delete;
    const isMoving = status === StickerStatus.moving;
    const disabled = isDeleting || isMoving || !isEditable;
    return (
        <div className={imageListStyles.item}>
            <Image className={imageListStyles.img} src={src} />
            {onDelete && (
                <Button
                    className={imageListStyles.close}
                    icon={<Delete16Regular />}
                    size="medium"
                    disabled={disabled}
                    appearance="transparent"
                    onClick={onDelete}
                />
            )}
            <div className={imageListStyles.bar}>
                <Input
                    className={imageListStyles.input}
                    appearance="underline"
                    size="medium"
                    disabled={disabled}
                    defaultValue={name}
                    onBlur={() => onEdit?.(currentName!)}
                    onChange={(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
                        setName(data.value);
                    }}
                />
            </div>
        </div>
    );
};

export default ImageItem;
