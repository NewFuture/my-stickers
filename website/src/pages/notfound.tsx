import { Button, Flex, Header } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import { TransKeys } from "../locales";
import { useTranslation } from "react-i18next";
import { useTitle } from "../lib/useTitle";
import Footer from "../components/Footer";

export default function NotFound() {
    const { t } = useTranslation();
    useTitle("404 " + t(TransKeys.not_found));
    return (
        <>
            <Header
                color="brand"
                align="center"
                content={t(TransKeys.not_found)}
                description={t(TransKeys.not_found)}
            />
            <Flex vAlign="center" hAlign="center">
                <Button as={Link} icon="arrow-left" to="/" primary content={t(TransKeys.homeTitle)} />
            </Flex>
            <Footer />
        </>
    );
}
