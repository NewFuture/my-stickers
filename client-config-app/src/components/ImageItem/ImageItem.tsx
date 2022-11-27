import React, { ChangeEvent, useRef } from "react";
import {
    Image,
    Button,
    Input,
    InputOnChangeData,
    PresenceBadge,
    PresenceBadgeStatus,
    mergeClasses,
    Spinner,
    Tooltip,
} from "@fluentui/react-components";
import { Sticker, StickerStatus } from "../../model/sticker";
import { DeleteRegular } from "@fluentui/react-icons";
import { useImageItemStyles } from "./ImageItem.styles";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
function mapStatus(status: Sticker["status"]): PresenceBadgeStatus | undefined {
    switch (status) {
        case StickerStatus.delete_fail:
        case StickerStatus.upload_fail:
        case StickerStatus.edit_fail:
            return "offline";
        case StickerStatus.editing:
        case StickerStatus.moving:
            return "busy";
        case StickerStatus.success:
            return "available";
        case StickerStatus.delete:
            return "out-of-office";
        default:
            return undefined;
    }
}

const ImageItem: React.FC<
    Sticker & {
        className?: string;
        isEditable?: boolean;
        lazy?: boolean;
        onDelete?: () => void;
        onEdit?: (name: string) => void;
    }
> = ({ src, name, status, isEditable, className, lazy, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const nameRef = useRef(name);
    const imageListStyles = useImageItemStyles();
    const badgeStatus = mapStatus(status);
    const isBusy = badgeStatus === "busy";
    const disabled = isBusy || !isEditable || status === StickerStatus.delete;
    return (
        <div className={mergeClasses(imageListStyles.root, className)}>
            <Tooltip content={name!} relationship="description">
                <Image className={imageListStyles.img} loading={lazy ? "lazy" : undefined} src={src} alt={name} />
            </Tooltip>
            {isBusy ? (
                <Spinner className={imageListStyles.status} size="tiny" />
            ) : (
                badgeStatus && <PresenceBadge className={imageListStyles.status} status={badgeStatus} size="large" />
            )}
            {onDelete && (
                <Tooltip content={t(TransKeys.delete)} relationship="label">
                    <Button
                        className={imageListStyles.del}
                        icon={<DeleteRegular />}
                        size="medium"
                        disabled={disabled}
                        appearance="transparent"
                        onClick={onDelete}
                    />
                </Tooltip>
            )}
            <div className={imageListStyles.bottom}>
                <Input
                    className={imageListStyles.inputWrapper}
                    input={{
                        className: imageListStyles.input,
                    }}
                    appearance="underline"
                    size="medium"
                    disabled={disabled}
                    defaultValue={name}
                    placeholder={t(TransKeys.inputPlaceholder)}
                    onFocus={(e) => e.target?.select?.()}
                    maxLength={64}
                    onBlur={() => {
                        const currentName = nameRef.current;
                        if (currentName && name?.trim() !== currentName?.trim() && onEdit) {
                            onEdit?.(currentName);
                        }
                    }}
                    onChange={(ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
                        nameRef.current = data.value;
                    }}
                />
            </div>
        </div>
    );
};

export default ImageItem;
