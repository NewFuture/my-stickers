import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App />);
    // document.querySelectorAll("style[data-fela-type]").forEach((s) => (s.innerHTML = ""));
} else {
    const root = createRoot(rootElement);
    root.render(<App />);
}
