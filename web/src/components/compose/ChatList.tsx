import React from "react";
import { Chat } from "@stardust-ui/react";
import { useMessages } from "./useMessages";
import { useTranslation } from "react-i18next";

export const ChatList: React.FC = () => {

    const [messages] = useMessages();
    const { i18n } = useTranslation();
    return <Chat styles={{ maxHeigth: "200px" }} items={messages.map((m, i) => ({ key: i18n.language + i, ...m }))} />;
};
