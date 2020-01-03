import { Flex, Button, Divider } from "@stardust-ui/react";
import { Common } from "../locales";
// import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="Footer">
            <Divider />
            <Flex vAlign="center" hAlign="center">
                <Button
                    as="a"
                    href="https://github.com/NewFuture/custom-stickers-teams-extension/issues/new"
                    text
                    secondary
                    size="smallest"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="info"
                >
                    {t(Common.feedback)}
                </Button>
                <Button
                    as="a"
                    href="https://github.com/NewFuture/custom-stickers-teams-extension"
                    text
                    secondary
                    size="smallest"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="info"
                >
                    Github
                </Button>
                <Button as="a" text secondary href="/privacy.html" target="_blank" size="smallest" color="info">
                    {t(Common.privacyTitle)}
                </Button>
                <Button as="a" text secondary href="/terms.html" target="_blank" size="smallest" color="info">
                    {t(Common.termsTitle)}
                </Button>
            </Flex>
        </footer>
    );
};

export default Footer;
