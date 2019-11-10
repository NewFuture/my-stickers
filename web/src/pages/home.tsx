import React from "react";
import { Header } from "@stardust-ui/react";
import { FormattedMessage } from "react-intl";
import { Messages } from "../locales";
import ChatWithPopover from "../components/chat";

export default function Home() {
    return <>
        <Header
            color="brand"
            align="center"
            content={<FormattedMessage id={Messages.title} />}
            description={<FormattedMessage id={Messages.description} />}
        />
        <ChatWithPopover />
    </>
}