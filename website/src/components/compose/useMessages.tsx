import React, { useReducer, createContext, Dispatch, useContext } from "react";
import { ChatItemProps, Chat, Divider, Image, Text } from "@fluentui/react-northstar";
import gutter from "../gutter";
import { Trans } from "react-i18next";
import { TransKeys } from "../../locales";
import { HeartIcon } from "../../icons/heart";
type Message = ChatItemProps; // ChatItemProps;

const date = new Date(Date.now() - 60000);
// const now = <Trans values={{ date }} i18nKey={TransKeys.date} />;
const messages: Message[] = [
    {
        gutter,
        message: (
            <Chat.Message
                author="NewFuture"
                content={<Trans i18nKey={TransKeys.protoComposeIntro} />}
                timestamp={<Trans i18nKey={TransKeys.protoMsgExtTime} />}
            />
        ),
    },
    {
        attached: "top",
        message: (
            <Chat.Message
                content={
                    <Text>
                        <Trans i18nKey={TransKeys.protoComposeIntroTip} />
                    </Text>
                }
            />
        ),
    },
    {
        children: <Divider content={<Trans i18nKey={TransKeys.protoComposeToday} />} color="brand" />,
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="NewFuture"
                content={
                    <Trans i18nKey={TransKeys.protoComposeStep1}>
                        <HeartIcon outline={true} />
                    </Trans>
                }
                timestamp={<Trans values={{ date }} i18nKey={TransKeys.date} />}
            />
        ),
    },
    {
        attached: "top",
        message: <Chat.Message content={<Trans i18nKey={TransKeys.protoComposeStep2} />} />,
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
                            timestamp={<Trans values={{ date }} i18nKey={TransKeys.date} />}
                            mine
                        />
                    ),
                },
            ];
    }
}

const context = createContext<[Message[], Dispatch<Action>]>([messages, () => {}]);

export const MessageProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [state, dispatch] = useReducer(reducer, messages);
    return <context.Provider value={[state, dispatch]}>{props.children}</context.Provider>;
};

export function useMessages(): [Message[], Dispatch<Action>] {
    return useContext(context);
}
