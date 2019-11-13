import React from "react";
import { Chat } from "@stardust-ui/react";
import { useMessages } from "./useMessages";

export const ChatList: React.FC = () => {
    const [messages] = useMessages();
    return <Chat styles={{ maxHeigth: "200px" }} items={messages.map((m, i) => ({ key: i, ...m }))} />;
};
