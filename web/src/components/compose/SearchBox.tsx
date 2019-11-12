import React from "react";
import { Image, Header, Input, Box, Grid } from "@stardust-ui/react";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const SearchBox: React.FC = props => {
    return (
        <Box>
            <Header as="h4" content="❤️ Stickers" />
            <Header as="h4">
                <Input fluid icon="search" placeholder="Select a sticker" />
            </Header>
            <Grid columns="3" rows="3">
                <Image src={helloSticker} title="Hello" styles={{ width: "7em", cursor: "pointer" }} />
                {/* <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} /> */}
            </Grid>
        </Box>
    );
};
export default SearchBox;
