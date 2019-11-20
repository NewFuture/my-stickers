import React from "react";
import { BrowserRouter as Router, RouteProps, Route, Switch } from "react-router-dom";
import { Provider, themes } from "@stardust-ui/react";

import "./lib/i18n";

import Config from "./pages/config";
import Home from "./pages/home";
import NotFound from "./pages/notfound";
import PrivacyPage from "./pages/privacy";
import TermsPage from "./pages/terms";
import { teams } from "@stardust-ui/react/dist/es/themes";

if (process.env.NODE_ENV === "development") {
    window.localStorage.felaDevMode = window.localStorage.stardustDebug = true;
}

const routes: RouteProps[] = [
    {
        // title: 'Home',
        path: ["/", "index.html"],
        component: Home,
        exact: true,
    },
    {
        // title: 'Config',
        path: ["/config.html"],
        component: Config,
        exact: false,
    },
    {
        path: ["/privacy.html"],
        component: PrivacyPage,
    },
    {
        path: ["/terms.html"],
        component: TermsPage,
    },
];
themes.teams.fontFaces = [];
const App: React.FC = () => {
    return (
        <Provider theme={themes.teams}>
            <Router>
                <Switch>
                    {routes.map((route, i) => (
                        <Route key={i} {...route} />
                    ))}
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;
