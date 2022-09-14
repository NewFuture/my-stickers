import React, { useEffect } from "react";
import { Header, Button, Text, Box, Flex, Provider, Video } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { HomePage, Common } from "../locales";
import ChatWithPopover from "../components/chat";
import Compose from "../components/compose";
import LanguageButton from "../components/language";
import HeartSvg from "../icons/heart";
import Footer from "../components/Footer";

import "./home.scss";
import { useTitle } from "../lib/useTitle";

const APP_LINK = "https://teams.microsoft.com/l/app/46fae4d0-faf5-11e9-80f3-53ad33b77bce?source=store-copy-link";

export default function Home() {
    const { t, i18n } = useTranslation();
    useTitle(t(Common.title));
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
                icons: {
                    heart: HeartSvg,
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
                content={t(Common.title)}
                description={t(Common.description)}
            ></Header>
            <Box styles={{ padding: "1em 0", textAlign: "center" }}>
                <Video
                    autoPlay
                    muted
                    styles={{
                        maxWidth: "100%",
                        width: "1920px",
                    }}
                    poster={`${process.env.PUBLIC_URL}/img/${i18n.language === "zh" ? "zh" : "en"}.png`}
                    src="https://sticker.newfuture.cc/video/install_set_up-1920.mp4"
                />
                <div>
                    <Button
                        styles={{ textDecoration: "none", margin: ".8em" }}
                        as="a"
                        href={APP_LINK}
                        icon="teams"
                        content={t(HomePage.downloadExtension)}
                        size="largest"
                        primary
                    ></Button>
                </div>
                <Text as="div" size="small" weight="light" important content={t(HomePage.tips)} />
            </Box>
            <Compose />
            <ChatWithPopover />
            <Flex hAlign="center">
                <Button
                    styles={{ textDecoration: "none", padding: "1em", margin: "1em" }}
                    as="a"
                    href={APP_LINK}
                    icon="teams"
                    content={t(HomePage.downloadExtension)}
                    size="largest"
                    circular
                    secondary
                ></Button>
            </Flex>
            <Footer />
        </Provider>
    );
}
