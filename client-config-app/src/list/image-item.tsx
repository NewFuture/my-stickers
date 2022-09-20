import React from "react";
import { Image, Label, Button, Spinner } from "@fluentui/react-components";
// import { Dialog } from "@fluentui/react-components/dist/unstable";

import { useTranslation } from "react-i18next";

import { Sticker, StickerStatus } from "../model/sticker";

import "./item.scss";
// import { ConfigPage } from "../locales";

const ImageItem: React.FC<
    Sticker & {
        onDelete: () => void;
        onEdit: (name: string) => void;
    }
> = ({ src, name, status, progress, onDelete }) => {
    const { t } = useTranslation();
    console.log(t);

    const isDeleting = status === StickerStatus.delete;
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

    console.log(state);
    return (
        <div className="ImageItem">
            <Image className="ImageItem-img" src={src} />
            <Button
                className="ImageItem-close"
                icon="close"
                size="small"
                disabled={isDeleting || isMoving}
                // loading={isDeleting}
                onClick={onDelete}
                // iconOnly
                // circular
            />
            <div className="ImageItem-bar">
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
