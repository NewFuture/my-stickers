import React, { useReducer, createContext, Dispatch, useContext, ReactText } from "react";
import { ChatItemProps, Chat, Divider, Image, Icon, ReactChildren } from "@stardust-ui/react";
import gutter from "../gutter";
import { Trans } from "react-i18next";
import { HomePage, NS, Common } from "../../locales";

type Message = ChatItemProps; // ChatItemProps;

const date = new Date(Date.now() - 60000);
const now = <Trans ns={NS.common} values={{ date }} i18nKey={Common.date} />;
const messages: Message[] = [
    {
        gutter,
        message: (
            <Chat.Message
                author="NewFuture"
                content={<Trans i18nKey={HomePage.protoComposeIntro} />}
                timestamp={<Trans i18nKey={HomePage.protoMsgExtTime} />}
            />
        ),
    },
    {
        attached: "top",
        message: (
            <Chat.Message
                content={
                    <small>
                        <Trans i18nKey={HomePage.protoComposeIntroTip} />
                    </small>
                }
            />
        ),
    },
    {
        children: <Divider content={<Trans i18nKey={HomePage.protoComposeToday} />} color="brand" />,
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="NewFuture"
                content={
                    <Trans i18nKey={HomePage.protoComposeStep1}>
                        <Icon name="heart" outline />
                    </Trans>
                }
                timestamp={now}
            />
        ),
    },
    {
        attached: "top",
        message: <Chat.Message content={<Trans i18nKey={HomePage.protoComposeStep2} />} />,
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
                    message: (
                        <Chat.Message
                            styles={{ margin: 0 }}
                            content={<Image className="Sticker" src={a.payload} />}
                            timestamp={<Trans ns={NS.common} values={{ date }} i18nKey={Common.date} />}
                            mine
                        />
                    ),
                },
            ];
    }
    return m;
}

const context = createContext<[Message[], Dispatch<Action>]>([messages, () => {}]);

export const MessageProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [state, dispatch] = useReducer(reducer, messages);
    return <context.Provider value={[state, dispatch]}>{props.children}</context.Provider>;
};

export function useMessages(): [Message[], Dispatch<Action>] {
    return useContext(context);
}
