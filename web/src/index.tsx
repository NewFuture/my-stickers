import React from "react";
import { hydrate, render } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
    document.querySelectorAll('style[data-fela-type]').forEach(s => s.innerHTML = '');
    hydrate(<App />, rootElement);
} else {
    render(<App />, rootElement);
}
