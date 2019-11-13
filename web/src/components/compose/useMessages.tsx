import React, { useReducer, createContext, Dispatch, useContext } from "react";
import { ChatItemProps, Chat, Divider, Image } from "@stardust-ui/react";
import gutter from "../gutter";
import { Trans } from "react-i18next";
import { HomePage, NS, Common } from "../../locales";


type Message = ChatItemProps; // ChatItemProps;

const date = new Date()
const now = <Trans ns={NS.common} values={{ date }} i18nKey={Common.date} />;
const messages: Message[] = [
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans ns={NS.homePage} i18nKey={HomePage.protoComposeIntro} />}
                timestamp={<Trans ns={NS.homePage} i18nKey={HomePage.protoMsgExtTime} />}
            />
        ),
    },
    {
        children: (
            <Divider
                content={<Trans ns={NS.homePage} i18nKey={HomePage.protoComposeToday} />}
                color="brand"
                important
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans ns={NS.homePage} i18nKey={HomePage.protoComposeStep1} />}
                timestamp={now}
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans ns={NS.homePage} i18nKey={HomePage.protoComposeStep2} />}
                timestamp={now}
            />
        ),
    },
];

type Action =
    | {
        type: "add";
        payload: Message;
    }
    | {
        type: "img";
        payload: string;
    };

function reducer(m: Message[], a: Action): Message[] {
    console.log(a.type);
    switch (a.type) {
        case "add":
            return [...m, a.payload];
        case "img":
            const date = new Date();
            return [
                ...m,
                {
                    contentPosition: "end",
                    attached: m.length > 3 ? "top" : undefined,
                    message: <Chat.Message
                        content={<Image src={a.payload} />}
                        timestamp={<Trans ns={NS.common} values={{ date }} i18nKey={Common.date} />}
                        mine />,
                },
            ];
    }
    return m;
}

const context = createContext<[Message[], Dispatch<Action>]>([messages, () => { }]);

export const MessageProvider: React.FC = props => {
    const [state, dispatch] = useReducer(reducer, messages);
    return <context.Provider value={[state, dispatch]}>{props.children}</context.Provider>;
};

export function useMessages(): [Message[], Dispatch<Action>] {
    return useContext(context);
}
