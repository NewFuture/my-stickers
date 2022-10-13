import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App />);
} else {
    const root = createRoot(rootElement);
    root.render(<App />);
}
