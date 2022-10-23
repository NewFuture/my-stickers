import { Header, Loader } from "@fluentui/react-northstar";
import React, { PropsWithChildren, Suspense } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import { useTitle } from "../lib/useTitle";
import type { TransKeys } from "../locales";

function Page({ children, titleKey }: PropsWithChildren<{ titleKey: TransKeys }>) {
    const { t } = useTranslation();
    const title = t(titleKey);
    useTitle(title);
    return (
        <>
            <Header content={title} align="center" />
            <Suspense fallback={<Loader size="large" />}>{children}</Suspense>
            <Footer />
        </>
    );
}
/**
 * Lazy load and render a markdown page
 * @param markdownFile
 * @param titleKey
 * @returns
 */
export function loadMarkdownPage(markdownFile: string, titleKey: TransKeys) {
    var LazyPage = React.lazy(() =>
        Promise.all([import("../components/markdown"), fetch(markdownFile).then((res) => res.text())]).then(
            ([Component, content]) => {
                const MD = Component.default;
                return {
                    default: function MDPage() {
                        return <MD>{content}</MD>;
                    },
                };
            },
        ),
    );
    return (
        <Page titleKey={titleKey}>
            <LazyPage />
        </Page>
    );
}
