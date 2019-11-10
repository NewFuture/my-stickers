import React from "react";
import { Header } from "@stardust-ui/react";
import { FormattedMessage } from "react-intl";
import { Messages } from "../locales";

export default function NotFound() {
    document.title = "404";
    return <Header
        color="brand"
        align="center"
        content={<FormattedMessage id={Messages.not_found} />}
        description={<FormattedMessage id={Messages.not_found} />}
    />
}