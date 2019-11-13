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
        <Segment styles={{textAlign:"center"}}>
            <Image
                src={src}
                styles={{
                    width: "28.5vw",
                    height: "28.5vw",
                }}
            />
            {edit ? (
                <Input icon="edit" value={label} inverted inline />
            ) : (
                label && <Label color="gray"  content={label} />
            )}
        </Segment>
    );
};

export default ImageItem;
