import React, { useReducer, createContext, Dispatch, useContext } from "react";
import { ChatItemProps, Chat, Divider, Image } from "@stardust-ui/react";
import gutter from "../gutter";
import { Trans, useTranslation } from "react-i18next";
import { HomePage, NS, Common } from "../../locales";

// const TimeStamp = () => {
//     const { t } = useTranslation(NS.homePage);
//     return <>{t(HomePage.protoComposeTime)}</>;
// };
type Message = ChatItemProps; // ChatItemProps;

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
                timestamp={<Trans ns={NS.common} values={{ date: new Date() }} i18nKey={Common.date} />}
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans ns={NS.homePage} i18nKey={HomePage.protoComposeStep2} />}
                timestamp={<Trans ns={NS.common} values={{ date: new Date() }} i18nKey={Common.date} />}
            />
        ),
    },
    // {
    //     message: (
    //         <Chat.Message content="Hello" author="John Doe" timestamp="Yesterday, 10:15 PM" mine />
    //     ),
    //     contentPosition: 'end',
    //     attached: 'top',
    // },
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
            return [
                ...m,
                {
                    contentPosition: "end",
                    message: <Chat.Message content={<Image src={a.payload} />} timestamp={new Date()} mine />,
                },
            ];
    }
    return m;
}

const context = createContext<[Message[], Dispatch<Action>]>([messages, () => {}]);

export const MessageProvider: React.FC = props => {
    useTranslation(NS.homePage);
    const [state, dispatch] = useReducer(reducer, messages);
    return <context.Provider value={[state, dispatch]}>{props.children}</context.Provider>;
};

export function useMessages(): [Message[], Dispatch<Action>] {
    useTranslation(NS.homePage);
    return useContext(context);
}
