import React, { useEffect } from "react";
import { Header, Button, Flex } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { HomePage, NS, Common } from "../locales";
import ChatWithPopover from "../components/chat";
import Compose from "../components/compose";

export default function Home() {
    const { t } = useTranslation([NS.common, NS.homePage]);
    useEffect(() => {
        document.title = t(Common.title);
    }, [t]);
    return (
        <>
            <Header
                as="h1"
                color="brand"
                align="center"
                styles={{
                    padding: "2em 0 1em",
                }}
                content={t(Common.title)}
                description={t(Common.description)}
            />
            <Flex hAlign="center" styles={{ padding: "1em" }}>
                <Button
                    styles={{ textDecoration: "none" }}
                    as="a"
                    href={process.env.PUBLIC_URL + "/custom-stickers.zip"}
                    download
                    icon="download"
                    content={t(HomePage.downloadExtension)}
                    size="largest"
                    primary
                ></Button>
            </Flex>
            <ChatWithPopover />
            <Compose />
        </>
    );
}
