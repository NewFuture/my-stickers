import React from "react";
import { BrowserRouter as Router, RouteProps, Route, Switch } from "react-router-dom";
import { Provider, themes } from "@stardust-ui/react";

// import { getLocale, getMessages } from "./locales";
import Config from "./pages/config";
import Home from "./pages/home";
import NotFound from "./pages/notfound";
import PrivacyPage from "./pages/privacy";

import "./lib/i18n";

import "./App.scss";
import TermsPage from "./pages/terms";

const routes: RouteProps[] = [
    {
        // title: 'Home',
        path: ["/", "index", "index.html"],
        component: Home,
        exact: true,
    },
    {
        // title: 'Config',
        path: ["/config", "/config.html"],
        component: Config,
        exact: false,
    },
    {
        path: ["/privacy", "/privacy.html"],
        component: PrivacyPage,
    },
    {
        path: ["/terms", "/terms.html"],
        component: TermsPage,
    },
];

const App: React.FC = () => {
    return (
        <Provider theme={themes.teams}>
            {/* <IntlProvider locale={getLocale()} messages={getMessages()}> */}
            <Router>
                <Switch>
                    {/* <Link to='/config' /> */}
                    {routes.map((route, i) => (
                        <Route key={i} {...route} />
                    ))}
                    <Route component={NotFound} />
                </Switch>
            </Router>
            {/* </IntlProvider> */}
        </Provider>
    );
};

export default App;
