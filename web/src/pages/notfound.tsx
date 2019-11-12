import React, { useEffect } from "react";
import { Header } from "@stardust-ui/react";
import { NS, Common } from "../locales";
import { useTranslation } from "react-i18next";
// import { FormattedMessage } from "react-intl";
// import { Messages } from "../locales";

export default function NotFound() {
    const { t } = useTranslation([NS.common, NS.homePage]);
    useEffect(() => {
        document.title = "404" + t(Common.not_found);
    }, [t]);
    return <Header color="brand" align="center" content={t(Common.not_found)} description={t(Common.not_found)} />;
}
