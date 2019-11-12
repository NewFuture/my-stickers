import {
    Chat,
    Provider,
    ChatMessageProps,
    ShorthandCollection,
    ReactionProps,
    Image,
    Reaction,
    Icon,
    Button,
} from "@stardust-ui/react";
import { Trans, Translation } from "react-i18next";
import React from "react";

import Popover from "./Popover";
// import ReactionPopup from './ReactionPopup'
import { Ref } from "@stardust-ui/react-component-ref";
import gutter from "../gutter";

import { HomePage, NS } from "../../locales";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const reactions: ShorthandCollection<ReactionProps> = [
    {
        icon: "like",
        content: 2333,
        key: "likes",
        variables: { meReacting: true },
    },
    // {
    //     icon: 'emoji',
    //     content: 666,
    //     key: 'smiles',
    // },
];

const reactionsWithPopup = reactions.map(reaction => (render: any) =>
    render(reaction, (_: any, props: any) => <Reaction {...props} />),
);

const ChatWithPopover: React.FC = () => {
    return (
        <Translation ns={NS.homePage}>
            {t => (
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
                            Menu: {
                                root: {
                                    background: "#fff",
                                    transition: "opacity 0.2s",
                                    position: "absolute",
                                    "& a:focus": {
                                        textDecoration: "none",
                                        color: "inherit",
                                    },
                                    "& a": {
                                        color: "inherit",
                                    },
                                },
                            },
                        },
                    }}
                >
                    <Chat
                        styles={{
                            margin: "auto",
                            padding: "1em",
                            width: "90%",
                            maxWidth: "1366px",
                        }}
                        items={[
                            {
                                key: "a",
                                message: (
                                    <Chat.Message
                                        author="New Future"
                                        content={
                                            <ol>
                                                <li>{t(HomePage.protoMsgExtStep1)}</li>
                                                <li>
                                                    <Trans i18nKey={HomePage.protoMsgExtStep2}>
                                                        <Icon name="more" />
                                                    </Trans>
                                                </li>
                                                <li>
                                                    <Trans i18nKey={HomePage.protoMsgExtStep3}>
                                                        <Button
                                                            icon="stardust-menu-arrow-end"
                                                            iconPosition="after"
                                                            primary
                                                            text
                                                            content={t(HomePage.protoMsgExtMenuMoreAction)}
                                                        />
                                                    </Trans>
                                                </li>
                                                <li>
                                                    <Trans i18nKey={HomePage.protoMsgExtStep4}>
                                                        <Button primary text content={t(HomePage.protoMsgExtMenuSaveStickers)} />
                                                    </Trans>
                                                </li>
                                            </ol>
                                        }
                                        timestamp={t(HomePage.protoMsgExtTime)}
                                    />
                                ),
                                gutter,
                            },
                            {
                                key: "b",
                                message: (
                                    <TeamsChatMessage
                                        author="New Future"
                                        data-is-focusable
                                        content={<Image src={helloSticker} />}
                                        dialogContent={<Image src={helloSticker} />}
                                        reactionGroup={{
                                            items: reactionsWithPopup,
                                        }}
                                        timestamp={t(HomePage.protoMsgExtTime)}
                                    />
                                ),
                                gutter,
                            },
                        ]}
                    />
                </Provider>
            )}
        </Translation>
    );
};

const TeamsChatMessage: React.FC<ChatMessageProps & { dialogContent: JSX.Element }> = props => {
    const [showActionMenu, setShowActionMenu] = React.useState(false);
    const [forceShowActionMenu, setForceShowActionMenu] = React.useState(false);
    const [chatMessageElement, setChatMessageElement] = React.useState<HTMLElement>();

    const handleBlur = (e: any) => !e.currentTarget.contains(e.relatedTarget) && setShowActionMenu(false);
    const { dialogContent, ...rest } = props;

    return (
        <Ref innerRef={setChatMessageElement}>
            <Chat.Message
                as="section"
                {...rest}
                actionMenu={(render: any) =>
                    render({}, (ComponentType: any, props: any) => (
                        <Popover
                            chatMessageElement={chatMessageElement}
                            onForceShowActionMenuChange={setForceShowActionMenu}
                            onShowActionMenuChange={setShowActionMenu}
                            dialogContent={dialogContent}
                            {...props}
                        />
                    ))
                }
                onMouseEnter={() => setShowActionMenu(true)}
                onMouseLeave={() => !forceShowActionMenu && setShowActionMenu(false)}
                onFocus={() => setShowActionMenu(true)}
                onBlur={handleBlur}
                variables={{ showActionMenu }}
            />
        </Ref>
    );
};

export default ChatWithPopover;
