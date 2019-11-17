import React from "react";
import { Grid } from "@stardust-ui/react";
import ImageItem from "./image-item";
import { Sticker } from "../../model/sticker";

interface Props {
    items: Sticker[];
}

const ImageList: React.FC<Props> = (props: Props) => (
    <Grid columns={3}>
        {props.items.map(item => (
            <ImageItem key={item.id} src={item.src} label={item.name} />
        ))}
    </Grid>
);

export default ImageList;
