import React from "react";
import { Menu, Popup, Icon, Image, Header, Flex, Input, Box, Grid } from "@stardust-ui/react";

const helloSticker = process.env.PUBLIC_URL + '/hello.gif';

const SearchBox: React.FC = (props) => {
    return (
        <Box>
            <Header as="h4" content="♥ Stickers" />
            <Header as="h4">
                <Input fluid icon="search" placeholder="Select a sticker" />            <Header />
            </Header>
            <Grid columns="3" rows="3">
                <Image src={helloSticker} styles={{width:"8em",cursor:"pointer"}} />
                {/* <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} />
                <Image src={helloSticker} /> */}
            </Grid>
        </Box>
    )
}
export default SearchBox;