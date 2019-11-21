import { Chat, ChatMessageProps, ShorthandCollection, ReactionProps, Image, Reaction, Icon } from "@stardust-ui/react";
import { Trans, Translation, useTranslation } from "react-i18next";
import React from "react";

import Popover from "./Popover";
// import ReactionPopup from './ReactionPopup'
import { Ref } from "@stardust-ui/react-component-ref";
import gutter from "../gutter";

import { HomePage, NS } from "../../locales";
import { MoreButton, SaveStickersButton } from "./buttons";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const reactions: ShorthandCollection<ReactionProps> = [
    {
        icon: "like",
        content: 2333,
        key: "likes",
        // variables: { meReacting: true },
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
                <Chat
                    items={[
                        {
                            key: "a",
                            message: (
                                <Chat.Message
                                    styles={{
                                        marginBottom: "2em",
                                    }}
                                    author="New Future"
                                    content={
                                        <ol>
                                            <li>{t(HomePage.protoMsgExtStep1)}</li>
                                            <li>
                                                <Trans i18nKey={HomePage.protoMsgExtStep2}>
                                                    <Icon name="more" color="brand" />
                                                </Trans>
                                            </li>
                                            <li>
                                                <Trans i18nKey={HomePage.protoMsgExtStep3}>
                                                    <MoreButton />
                                                </Trans>
                                            </li>
                                            <li>
                                                <Trans i18nKey={HomePage.protoMsgExtStep4}>
                                                    <SaveStickersButton />
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
                                    content={<Image className="Sticker" src={helloSticker} />}
                                    dialogContent={<Image className="Sticker" src={helloSticker} />}
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
    const { t } = useTranslation(NS.homePage);
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
                            t={t}
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
