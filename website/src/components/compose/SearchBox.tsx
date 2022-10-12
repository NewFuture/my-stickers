import React from "react";
import { Image, Header, Input, Box, Grid, Icon } from "@stardust-ui/react";
import { useMessages } from "./useMessages";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const SearchBox: React.FC = (props) => {
    const [, dispatchMessage] = useMessages();
    const { t } = useTranslation();
    return (
        <Box>
            <Header as="h4">
                <Icon name="heart" color="orange" /> {t(TransKeys.shortTitle)}
            </Header>
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
            </Grid>
        </Box>
    );
};
export default SearchBox;
