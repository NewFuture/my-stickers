import React from "react";
import ReactDOM from "react-dom";
import ChatMessage from "./index";
import "../../lib/i18n";
import { Provider, teamsTheme } from "@fluentui/react-northstar";

if (document) {
    document.createRange = () =>
        ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: "BODY",
                ownerDocument: document,
            },
        } as any as Range);
}
it("Chat renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <Provider theme={teamsTheme}>
            <ChatMessage />
        </Provider>,
        div,
    );
    ReactDOM.unmountComponentAtNode(div);
});
