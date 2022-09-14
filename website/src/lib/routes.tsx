import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/home";
import NotFound from "../pages/notfound";

const PrivacyPage = React.lazy(() => import("../pages/privacy"));
const TermsPage = React.lazy(() => import("../pages/terms"));

export const routes = [
    <Route key="home" path="/" element={<Home />} />,
    <Route key="privacy" path="/privacy.html" element={<PrivacyPage />} />,
    <Route key="terms" path="/terms.html" element={<TermsPage />} />,
    <Route key="*" path="*" element={<NotFound />} />,
];
