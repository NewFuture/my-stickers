import React from "react";
import { BrowserRouter as Router, RouteProps, Route, Switch } from 'react-router-dom'
// import Helmet from 'react-helmet';
import { Provider, themes } from "@stardust-ui/react";
import "./App.scss";

import { IntlProvider } from "react-intl";
import { getLocale, getMessages } from "./locales";
import Config from "./pages/config";
import Home from "./pages/home";

const routes: RouteProps[] = [
    {
        // title: 'Home',
        path: '/',
        component: Home,
        exact: true
    }, {
        // title: 'About',
        path: '/config',
        component: Config
    }
]

const App: React.FC = () => {
    return (
        <Provider theme={themes.teams}>
            <IntlProvider locale={getLocale()} messages={getMessages()}>
                <Router>
                    <Switch>
                        {routes.map((route, i) => (
                            <Route key={i}  {...route} />
                        ))}
                        <Route component={Home} />
                    </Switch>
                </Router>
            </IntlProvider>
        </Provider>
    );
};

export default App;
