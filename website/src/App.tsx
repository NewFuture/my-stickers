import React, { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { Loader, Provider, themes } from "@stardust-ui/react";
import "./lib/i18n";
import { routes } from "./lib/routes";

import "./App.scss";

if (process.env.NODE_ENV === "development") {
    window.localStorage.felaDevMode = window.localStorage.stardustDebug = true;
}

themes.teams.fontFaces = [];
const App: React.FC = () => {
    return (
        <Provider theme={themes.teams}>
            <Suspense fallback={<></>}>
                <BrowserRouter>
                    <Routes>{routes}</Routes>
                </BrowserRouter>
            </Suspense>
        </Provider>
    );
};

export default App;
