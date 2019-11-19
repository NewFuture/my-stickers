import React, { ChangeEvent } from "react";
import { Button } from "@stardust-ui/react";
import { useSelector } from "react-redux";
import { StateType } from "../store";
import { uploadStickers } from "../services/stickers";

export interface PropType {
    multiple?: boolean;
    // onChange: ChangeEventHandler<HTMLInputElement>;
}

const MAX_NUM = 100;
const MAX_SIZE = 1000 * 1024;


const UploadButton: React.FC<PropType> = props => {
    const n = useSelector((state: StateType) => state.stickers.length);

    /**
    * @todo 限制文件大小
    * @param e
    */
    function ImageUploadHandler(e: ChangeEvent<HTMLInputElement>) {
        const files = [...e.target.files];
        const filtered = files.filter((v) => v.size < MAX_SIZE);
        if (filtered.length !== files.length) {
            alert("暂不支持超过1M的图片,超过的自动过滤");
        }
        if (filtered.length + n > MAX_NUM) {
            alert(`最多支持${MAX_NUM}张表情`);
        }
        uploadStickers(filtered.slice(0, MAX_NUM - n));
    }

    return (
        <span>
            <Button as="label" disabled={n >= MAX_NUM} htmlFor="image-upload" icon="add" content={props.children} />
            <input
                hidden
                disabled={n >= MAX_NUM}
                type="file"
                id="image-upload"
                onChange={ImageUploadHandler}
                multiple={!!props.multiple}
                accept="image/png, image/jpeg, image/gif"
            />
        </span>
    )
};

export default UploadButton;
