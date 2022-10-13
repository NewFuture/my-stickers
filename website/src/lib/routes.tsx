import { Route } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notfound";
import { TransKeys } from "../locales";
import { loadMarkdownPage } from "../pages/markdownPage";

import privacyStatement from "../markdown/privacy.md";
import termsStatement from "../markdown/terms.md";
import helpStatement from "../markdown/help.md";

const privacyPage = loadMarkdownPage(privacyStatement, TransKeys.privacyTitle);
const termsPage = loadMarkdownPage(termsStatement, TransKeys.termsTitle);
const helpPage = loadMarkdownPage(helpStatement, TransKeys.helpTitle);

export const routes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="privacy" path="/index.html" element={<Home />} />,
    <Route key="privacy" path="/privacy.html" element={privacyPage} />,
    <Route key="privacy" path="/privacy" element={privacyPage} />,
    <Route key="terms" path="/terms.html" element={termsPage} />,
    <Route key="terms" path="/terms" element={termsPage} />,
    <Route key="help" path="/help.html" element={helpPage} />,
    <Route key="help" path="/help" element={helpPage} />,
    <Route key="*" path="*" element={<NotFound />} />,
];
