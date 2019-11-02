import React from "react";
import { Image, Label, Segment, Input } from "@stardust-ui/react";

export interface PropTypes {
    src: string;
    label?: string;
    edit?: false;
}
const ImageItem: React.FC<PropTypes> = (props: PropTypes) => {
    const { src, label, edit } = props;
    return (
        <Segment inverted>
            <Image
                src={src}
                styles={{
                    width: "200px",
                    height: "200px",
                }}
            />
            {edit ? (
                <Input icon="edit" value={label} inverted inline />
            ) : (
                label && <Label color="black" content={label} />
            )}
        </Segment>
    );
};

export default ImageItem;
