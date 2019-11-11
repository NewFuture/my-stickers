import React from "react";
import { Header, Button, Flex } from "@stardust-ui/react";
import { FormattedMessage } from "react-intl";
import { Messages } from "../locales";
import ChatWithPopover from "../components/chat";
import Compose from "../components/compose";

export default function Home() {
    return <>
        <Header
            as="h1"
            color="brand"
            align="center"
            styles={{
                padding: "2em 0 1em"
            }}
            content={<FormattedMessage id={Messages.title} />}
            description={<FormattedMessage id={Messages.description} />}
        />
        <Flex hAlign="center" styles={{ padding: "1em" }}>
            <Button styles={{ textDecoration: "none" }} as="a" href={process.env.PUBLIC_URL + '/custom-stickers.zip'} download icon="download" content={<FormattedMessage id={Messages.home_downloadExtension} />} size="largest" primary></Button>
        </Flex>
        <ChatWithPopover />
        <Compose/>
    </>
}