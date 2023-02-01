import { Flex, Button, Divider } from "@fluentui/react-northstar";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TransKeys } from "../locales";

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="Footer">
            <Divider />
            <Flex vAlign="center" hAlign="center" wrap>
                <Button to="/" as={Link} text secondary size="small" color="info">
                    {t(TransKeys.homeTitle)}
                </Button>
                <Button
                    as="a"
                    href="https://github.com/NewFuture/my-stickers/issues/new"
                    text
                    secondary
                    size="small"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="info"
                >
                    {t(TransKeys.feedback)}
                </Button>
                <Button
                    as="a"
                    href="https://github.com/NewFuture/my-stickers"
                    text
                    secondary
                    size="small"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="info"
                >
                    Github
                </Button>
                <Button to="/help.html" as={Link} text secondary size="small" color="info">
                    {t(TransKeys.helpTitle)}
                </Button>
                <Button to="/privacy.html" as={Link} text secondary size="small" color="info">
                    {t(TransKeys.privacyTitle)}
                </Button>
                <Button to="/terms.html" as={Link} text secondary size="small" color="info">
                    {t(TransKeys.termsTitle)}
                </Button>
            </Flex>
        </footer>
    );
};

export default Footer;
