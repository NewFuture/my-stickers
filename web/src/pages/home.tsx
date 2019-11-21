import React, { useEffect } from "react";
import { Header, Button, Text, Box, Flex, Provider, Video, Divider } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { HomePage, Common } from "../locales";
import ChatWithPopover from "../components/chat";
import Compose from "../components/compose";
import LanguageButton from "../components/language";
import HeartSvg from "../icons/heart";
import Footer from "../components/Footer";

import "./home.scss";

export default function Home() {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t(Common.title);
    }, [t]);
    return (
        <Provider
            theme={{
                componentStyles: {
                    Header: {
                        root: { marginTop: 0 },
                    },
                    Chat: {
                        root: {
                            padding: "1em",
                            width: "90vw",
                            minWidth: "300px",
                            maxWidth: "1366px",
                            maxHeight: "555px",
                            overflow: "scroll",
                        },
                    },
                    ChatMessage: {
                        root: {
                            maxWidth: "80vw",
                            minWidth: "12rem",
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
                    styles={{
                        maxWidth: "100%",
                    }}
                    // poster="public/images/tears-of-steel.jpg"
                    src="https://sticker.newfuture.cc/video/install_trim.mp4"
                />
                <div>
                    <Button
                        styles={{ textDecoration: "none", margin: ".8em" }}
                        as="a"
                        href={process.env.PUBLIC_URL + "/custom-stickers.zip"}
                        download
                        icon="download"
                        content={t(HomePage.downloadExtension)}
                        size="largest"
                        primary
                    ></Button>
                </div>
                <Text as="div" size="small" weight="light" important content={t(HomePage.tips)} />
            </Box>
            <ChatWithPopover />
            <Compose />
            <Flex hAlign="center">
                <Button
                    styles={{ textDecoration: "none", padding: "1em", margin: "1em" }}
                    as="a"
                    href={process.env.PUBLIC_URL + "/custom-stickers.zip"}
                    icon="download"
                    content={t(HomePage.downloadExtension)}
                    size="largest"
                    download
                    circular
                    secondary
                ></Button>
            </Flex>
            <Divider />
            <Footer />
        </Provider>
    );
}
