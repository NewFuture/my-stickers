import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Markdown from "../components/markdown";
import { useTitle } from "../lib/useTitle";
import { Common } from "../locales";

import statement from "../markdown/terms.md";

export default function TermsPage() {
    const { t } = useTranslation();
    useTitle(t(Common.termsTitle));
    return (
        <>
            <Markdown file={statement} />
            <Footer />
        </>
    );
}
