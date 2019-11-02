import React, { ChangeEventHandler } from "react";
import { Button } from "@stardust-ui/react";
import { FormattedMessage } from "react-intl";
import { Messages } from "../locales";

export interface PropType {
    multiple?: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = (props: PropType) => (
    <span>
        <Button
            as="label"
            htmlFor="image-upload"
            icon="add"
            content={<FormattedMessage id={Messages.upload} />}
        ></Button>
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
