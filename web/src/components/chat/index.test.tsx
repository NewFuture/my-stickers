import React from "react";
import ReactDOM from "react-dom";
import { Provider, themes } from "@stardust-ui/react";

import ChatMessage from "./index";
if (document) {
    document.createRange = () =>
        (({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: "BODY",
                ownerDocument: document,
            },
        } as any) as Range);
}
it("Chat renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <Provider theme={themes.teams}>
            <ChatMessage />
        </Provider>,
        div,
    );
    ReactDOM.unmountComponentAtNode(div);
});
