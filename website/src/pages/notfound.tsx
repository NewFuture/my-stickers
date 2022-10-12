import { Button, Flex, Header } from "@fluentui/react-northstar";
import { NS, Common } from "../locales";
import { useTranslation } from "react-i18next";
import { useTitle } from "../lib/useTitle";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function NotFound() {
    const { t } = useTranslation([NS.common, NS.homePage]);
    useTitle("404 " + t(Common.not_found));
    return (
        <>
            <Header color="brand" align="center" content={t(Common.not_found)} description={t(Common.not_found)} />
            <Flex vAlign="center" hAlign="center">
                <Button as={Link} icon="arrow-left" to="/" primary content={t(Common.homeTitle)} />
            </Flex>
            <Footer />
        </>
    );
}
