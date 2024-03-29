import React from "react";
import { Image, Header, Input, Box, Grid, SearchIcon } from "@fluentui/react-northstar";
import { useMessages } from "./useMessages";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { HeartIcon } from "../../icons/heart";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const SearchBox: React.FC = (props) => {
    const [, dispatchMessage] = useMessages();
    const { t } = useTranslation();
    return (
        <Box>
            <Header as="h4">
                <HeartIcon styles={{ color: "#cc4a31" }} /> {t(TransKeys.shortTitle)}
            </Header>
            <Header as="h4">
                <Input fluid icon={<SearchIcon />} placeholder={t(TransKeys.protoComposeInput)} />
            </Header>
            <Grid columns="3" rows="3">
                <Image
                    src={helloSticker}
                    title="Hello"
                    styles={{ width: "7em", cursor: "pointer" }}
                    onClick={() => {
                        dispatchMessage({ type: "img", payload: helloSticker });
                    }}
                    loading="lazy"
                />
            </Grid>
        </Box>
    );
};
export default SearchBox;
