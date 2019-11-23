import React from "react";
import { render } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root")!;
// if (rootElement.hasChildNodes()) {
//     hydrate(<App />, rootElement);
// } else {
//     render(<App />, rootElement);
// }
render(<App />, rootElement);

