import React, { ChangeEventHandler } from "react";
import { Button } from "@stardust-ui/react";

export interface PropType {
    multiple?: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const UploadButton: React.FC<PropType> = props => (
    <span>
        <Button as="label" htmlFor="image-upload" icon="add" content={props.children} />
        <input
            hidden
            type="file"
            id="image-upload"
            onChange={props.onChange}
            multiple={!!props.multiple}
            accept="image/png, image/jpeg, image/gif"
        />
    </span>
);

export default UploadButton;
