import React from "react";
import { Image, Header, Input, Box, Grid } from "@stardust-ui/react";
import { useMessages } from "./useMessages";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const SearchBox: React.FC = props => {
    const [, dispatchMessage] = useMessages();

    return (
        <Box>
            <Header as="h4" content="❤️ Stickers" />
            <Header as="h4">
                <Input fluid icon="search" placeholder="Select a sticker" />
            </Header>
            <Grid columns="3" rows="3">
                <Image
                    src={helloSticker}
                    title="Hello"
                    styles={{ width: "7em", cursor: "pointer" }}
                    onClick={() => {
                        dispatchMessage({ type: "img", payload: helloSticker });
                    }}
                />
                {/* <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} /> */}
            </Grid>
        </Box>
    );
};
export default SearchBox;
