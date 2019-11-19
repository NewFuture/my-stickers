import React, { ChangeEvent } from "react";
import { Button } from "@stardust-ui/react";
import { useSelector } from "react-redux";
import { StateType } from "../../store";
import { uploadStickers } from "../../services/stickers";

export interface PropType {
    multiple?: boolean;
    disabled?: boolean;
    // onChange: ChangeEventHandler<HTMLInputElement>;
}

const MAX_NUM = 100;
const MAX_SIZE = 1000 * 1024;

const UploadButton: React.FC<PropType> = props => {
    const n = useSelector((state: StateType) => state.stickers.length);
    const disabled = props.disabled || n >= MAX_NUM;

    /**
     * @todo 限制文件大小
     * @param e
     */
    function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const files = [...e.target.files];
        const filtered = files.filter(v => v.size < MAX_SIZE);
        if (filtered.length !== files.length) {
            alert("暂不支持超过1M的图片,超过的自动过滤");
        }
        if (filtered.length + n > MAX_NUM) {
            alert(`最多支持${MAX_NUM}张表情`);
        }
        if (filtered.length) {
            uploadStickers(filtered.slice(0, MAX_NUM - n));
        }
    }

    return (
        <>
            <Button as="label" disabled={disabled} htmlFor="image-upload" icon="add" content={props.children} />
            <input
                hidden
                disabled={disabled}
                type="file"
                id="image-upload"
                onChange={ImageUploadHandler}
                multiple={!!props.multiple}
                accept="image/png, image/jpeg, image/gif"
            />
        </>
    );
};

export default UploadButton;
