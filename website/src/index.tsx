import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
    document.querySelectorAll("style[data-fela-type]").forEach((s) => (s.innerHTML = ""));
    hydrateRoot(rootElement, <App />);
} else {
    const root = createRoot(rootElement);
    root.render(<App />);
}
