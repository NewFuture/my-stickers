import BottomMenu from "./BottomMenu";
import React from "react";
import { Chat, Provider, TextArea, ChatItemProps, Divider } from "@stardust-ui/react";
import { ComponentPrototype, PrototypeSection } from "../Prototype";
import gutter from "../gutter";
import { useTranslation, Trans } from "react-i18next";
import { NS, HomePage } from "../../locales";


const TimeStamp = () => {
    const { t } = useTranslation(NS.homePage);
    return <>{t(HomePage.protoComposeTime)}</>
}
const messages: ChatItemProps[] = [
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans i18nKey={HomePage.protoComposeIntro} />}
                timestamp={<Trans i18nKey={HomePage.protoMsgExtTime} />}
            />
        ),
    },
    {
        children: <Divider content="♥" color="brand" important />,
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans i18nKey={HomePage.protoComposeStep1} />}
                timestamp={<TimeStamp />}
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<Trans i18nKey={HomePage.protoComposeStep2} />}
                timestamp={<TimeStamp />}
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
export default function Compose(props: any) {
    const { t } = useTranslation([NS.homePage])
    return (
        <PrototypeSection title={t(HomePage.protoComposeTitle)}>
            <ComponentPrototype
                title={t(HomePage.protoComposeSubTitle)}
            // description="Click save stciker in the more action menu list can save it!"
            >
                <Provider
                    theme={{
                        componentStyles: {
                            ChatMessage: {
                                root: (opts: any) => ({
                                    marginBottom: "2em",
                                    "& a": {
                                        color: opts.theme.siteVariables.colors.brand[600],
                                    },
                                }),
                            },
                        },
                    }}
                >
                    <Chat items={messages.map((m, i) => ({ key: i, ...m }))} />
                    <TextArea
                        // fluid={true}
                        disabled
                        variables={{ height: "3em" }}
                        styles={{ margin: "0.5em 0", width: "100%" }}
                        placeholder="using compose extensions to send messages"
                    />
                    <BottomMenu />
                </Provider>
            </ComponentPrototype>
        </PrototypeSection>
    );
}
