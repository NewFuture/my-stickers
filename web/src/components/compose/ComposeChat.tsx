import React from "react";
import { TextArea } from "@stardust-ui/react";

import { MessageProvider } from "./useMessages";
import { ChatList } from "./ChatList";
import BottomMenu from "./BottomMenu";

import "./compose.scss";

export const ComposeChat: React.FC = () => (
    <MessageProvider>
        <ChatList />
        <div className="Compose">
            <TextArea className="Compose-textArea" disabled placeholder="using compose extensions to send messages" />
            <BottomMenu className="Compose-bar" />
        </div>
    </MessageProvider>
);
