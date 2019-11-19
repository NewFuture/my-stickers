import React from "react";
import { Image, Label, Segment, Input, Status, StatusProps, Loader, Button } from "@stardust-ui/react";
import { Sticker, StickerStatus } from "../../model/sticker";

import "./item.scss";

const ImageItem: React.FC<Sticker & {
    onDelete: () => void;
}> = props => {
    const { src, name, status, progress } = props;
    const isDeleting = status === StickerStatus.delete;
    let state: StatusProps["state"] = undefined;
    let icon = "";

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
            state = "warning";
            break;
        default:
            if (status) {
                state = "unknown";
            }
    }

    return (
        <Segment className="ImageItem">
            <Image className="ImageItem-img" src={src} />
            <Button
                className="ImageItem-close"
                icon="close"
                size="small"
                disabled={isDeleting}
                loading={isDeleting}
                onClick={props.onDelete}
                iconOnly
                circular
            />
            <div className="ImageItem-bar">
                {icon === "loading" ? (
                    <Loader size="smallest" inline label={progress + "%"} labelPosition="end" />
                ) : (
                    state && <Status state={state} icon={icon} size="largest" />
                )}
                {icon !== "loading" && name && <Label color="gray" content={name} />}
            </div>
            {status === StickerStatus.editing && <Input icon="edit" value={name} inverted inline />}
        </Segment>
    );
};

export default ImageItem;
