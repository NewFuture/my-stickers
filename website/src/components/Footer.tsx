import { Flex, Button, Divider } from "@fluentui/react-northstar";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Common } from "../locales";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="Footer">
            <Divider />
            <Flex vAlign="center" hAlign="center">
                <Button to="/" as={Link} text secondary size="small" color="info">
                    {t(Common.homeTitle)}
                </Button>
                <Button
                    as="a"
                    href="https://github.com/NewFuture/custom-stickers-teams-extension/issues/new"
                    text
                    secondary
                    size="small"
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
                    size="small"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="info"
                >
                    Github
                </Button>
                <Button to="/privacy.html" as={Link} text secondary size="small" color="info">
                    {t(Common.privacyTitle)}
                </Button>
                <Button to="/terms.html" as={Link} text secondary size="small" color="info">
                    {t(Common.termsTitle)}
                </Button>
            </Flex>
        </footer>
    );
};

export default Footer;
