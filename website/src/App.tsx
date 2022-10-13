import "./App.scss";

import { useEffect } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { Provider, teamsTheme } from "@fluentui/react-northstar";

import i18n, { getLng } from "./lib/i18n";
import { routes } from "./lib/routes";

if (process.env.NODE_ENV === "development") {
    window.localStorage.felaDevMode = window.localStorage.fluentUIDebug = true;
}

teamsTheme.fontFaces = [];

export default function App() {
    useEffect(() => {
        const lng = getLng();
        if (lng && !lng.startsWith("en")) {
            i18n.changeLanguage(lng);
        }
    });
    return (
        <Provider theme={teamsTheme}>
            <BrowserRouter>
                <Routes>{routes}</Routes>
            </BrowserRouter>
        </Provider>
    );
}
