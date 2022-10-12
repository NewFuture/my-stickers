import React from "react";
import { Chat } from "@fluentui/react-northstar";
import { useMessages } from "./useMessages";
import { useTranslation } from "react-i18next";

export const ChatList: React.FC = () => {
    const [messages] = useMessages();
    const { i18n } = useTranslation();
    return <Chat items={messages.map((m, i) => ({ key: i18n.language + i, ...m }))} />;
};
