import { Header, Button, Text, Box, Flex, Provider, Video, TeamsMonochromeIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../locales";
import ChatWithPopover from "../components/chat";
import Compose from "../components/compose";
import LanguageButton from "../components/language";
import Footer from "../components/Footer";
import { useTitle } from "../lib/useTitle";

import cover from "../img/cover.jpeg";

const APP_LINK = "https://teams.microsoft.com/l/app/46fae4d0-faf5-11e9-80f3-53ad33b77bce";

export default function Home() {
    const { t } = useTranslation();
    useTitle(t(TransKeys.title));
    return (
        <Provider
            theme={{
                componentStyles: {
                    Header: {
                        root: { marginTop: 0 },
                    },
                    Chat: {
                        root: {
                            padding: "1em .5em",
                            width: "100%",
                            minWidth: "300px",
                            height: "48vw",
                            minHeight: "440px",
                            maxHeight: "560px",
                            overflow: "scroll",
                        },
                    },
                    ChatMessage: {
                        root: {
                            maxWidth: "80vw",
                            minWidth: "12.8rem",
                            marginRight: "5rem",
                        },
                    },
                    Menu: {
                        root: {
                            background: "#fff",
                            transition: "opacity 0.2s",
                            position: "absolute",
                            "& a:focus": {
                                textDecoration: "none",
                                color: "inherit",
                            },
                            "& a": {
                                color: "inherit",
                            },
                        },
                    },
                },
            }}
        >
            <LanguageButton
                styles={{
                    position: "absolute",
                    top: "1em",
                    right: "1.5em",
                }}
            />
            <Header
                as="h1"
                color="brand"
                align="center"
                styles={{ padding: "2em 0 1em" }}
                content={t(TransKeys.title)}
                description={t(TransKeys.description)}
            ></Header>
            <Box styles={{ padding: "1em 0", textAlign: "center" }}>
                <Video
                    autoPlay
                    loop
                    styles={{
                        maxWidth: "100%",
                        width: "1920px",
                    }}
                    poster={cover}
                    src="https://sticker.newfuture.cc/video/my-stickers-v2.mp4"
                />
                <div>
                    <Button
                        styles={{ textDecoration: "none", margin: ".8em" }}
                        as="a"
                        href={APP_LINK}
                        icon={<TeamsMonochromeIcon />}
                        content={t(TransKeys.downloadExtension)}
                        size="medium"
                        primary
                    ></Button>
                </div>
                <Text as="div" size="small" weight="light" important content={t(TransKeys.tips)} />
            </Box>
            <Compose />
            <ChatWithPopover />
            <Flex hAlign="center">
                <Button
                    styles={{ textDecoration: "none", padding: "1em", margin: "1em" }}
                    as="a"
                    href={APP_LINK}
                    icon={<TeamsMonochromeIcon />}
                    content={t(TransKeys.downloadExtension)}
                    size="medium"
                    circular
                    secondary
                ></Button>
            </Flex>
            <Footer />
        </Provider>
    );
}
