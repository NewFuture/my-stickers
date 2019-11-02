// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
import React from "react";
import ReactDOM from "react-dom";
import { Provider, themes } from "@stardust-ui/react";
import * as serviceWorker from "./serviceWorker";
import { IntlProvider} from "react-intl";
import App from "./App";
import { getMessages, getLocale } from "./locales";



ReactDOM.render(
    <Provider theme={themes.teams}>
        <IntlProvider locale={getLocale()} messages={getMessages()}>
            <App />
        </IntlProvider>
    </Provider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
