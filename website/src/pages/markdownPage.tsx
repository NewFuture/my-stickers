import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import { useTitle } from "../lib/useTitle";
import type { TransKeys } from "../locales";

/**
 * Lazy load and render a markdown page
 * @param markdownFile
 * @param titleKey
 * @returns
 */
export function loadMarkdownPage(markdownFile: string, titleKey: TransKeys) {
    return React.lazy(() =>
        Promise.all([import("../components/markdown"), fetch(markdownFile).then((res) => res.text())]).then(
            ([Component, content]) => {
                const MD = Component.default;
                return {
                    default: function MDPage() {
                        const { t } = useTranslation();
                        useTitle(t(titleKey));
                        return (
                            <>
                                <MD>{content}</MD>;
                                <Footer />
                            </>
                        );
                    },
                };
            },
        ),
    );
}
