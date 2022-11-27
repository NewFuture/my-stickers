import { createRoot } from "react-dom/client";
import App from "./App";
import "./app.css";

const rootElement = document.getElementById("root")!;

const root = createRoot(rootElement);
root.render(<App />);
