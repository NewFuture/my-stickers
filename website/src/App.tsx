import React, { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import "./lib/i18n";
import { routes } from "./lib/routes";

import "./App.scss";

if (process.env.NODE_ENV === "development") {
    window.localStorage.felaDevMode = window.localStorage.fluentUIDebug = true;
}



teamsTheme.fontFaces = [];

const App: React.FC = () => {
    return (
        <Provider theme={teamsTheme}>
            <Suspense fallback={<></>}>
                <BrowserRouter>
                    <Routes>{routes}</Routes>
                </BrowserRouter>
            </Suspense>
        </Provider>
    );
};

export default App;
