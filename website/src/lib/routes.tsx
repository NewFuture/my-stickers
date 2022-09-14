import { Route } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notfound";
import { Common } from "../locales";
import { loadMarkdownPage } from "../pages/markdownPage";

import privacyStatement from "../markdown/privacy.md";
import termsStatement from "../markdown/terms.md";

const PrivacyPage = loadMarkdownPage(privacyStatement, Common.privacyTitle);
const TermsPage = loadMarkdownPage(termsStatement, Common.termsTitle);

export const routes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="privacy" path="/privacy.html" element={<PrivacyPage />} />,
    <Route key="terms" path="/terms.html" element={<TermsPage />} />,
    <Route key="*" path="*" element={<NotFound />} />,
];
