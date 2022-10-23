import { Button, Flex, Header } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import { TransKeys } from "../locales";
import { useTranslation } from "react-i18next";
import { useTitle } from "../lib/useTitle";
import Footer from "../components/Footer";

export default function NotFound() {
    const { t } = useTranslation();
    useTitle("404 " + t(TransKeys.notFound));
    return (
        <>
            <Header color="brand" align="center" content={t(TransKeys.notFound)} description={t(TransKeys.notFound)} />
            <Flex vAlign="center" hAlign="center">
                <Button as={Link} icon="arrow-left" to="/" primary content={t(TransKeys.homeTitle)} />
            </Flex>
            <Footer />
        </>
    );
}
