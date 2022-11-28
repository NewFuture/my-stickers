import { Trans, Translation } from "react-i18next";
import React from "react";
import gutter from "../gutter";
import { TransKeys } from "../../locales";
import { MoreButton, SaveStickersButton, StickersSavedTitle } from "./buttons";
import {
    Chat,
    ChatMessageProps,
    Dialog,
    ShorthandCollection,
    ReactionProps,
    Image,
    CloseIcon,
    LikeIcon,
    MoreIcon,
} from "@fluentui/react-northstar";
import { useActionItems } from "./useActionItems";

const helloSticker = process.env.PUBLIC_URL + "/hello.gif";

const reactions: ShorthandCollection<ReactionProps> = [
    {
        icon: <LikeIcon />,
        content: "2333",
        key: "likes",
    },
];

const ChatWithPopover: React.FC = () => {
    const sticker = (
        <Image
            className="Sticker"
            alt="a sticker named hello"
            loading="lazy"
            src={helloSticker}
            width="240"
            height="240"
        />
    );
    return (
        <Translation>
            {(t) => (
                <Chat
                    items={[
                        {
                            key: "a",
                            message: (
                                <Chat.Message
                                    styles={{
                                        marginBottom: "2em",
                                    }}
                                    author="NewFuture"
                                    content={
                                        <ol>
                                            <li>{t(TransKeys.protoMsgExtStep1)}</li>
                                            <li>
                                                <Trans i18nKey={TransKeys.protoMsgExtStep2}>
                                                    {/* <Icon name="more" color="brand" />
                                                     */}
                                                    <MoreIcon color="brand" />
                                                </Trans>
                                            </li>
                                            <li>
                                                <Trans i18nKey={TransKeys.protoMsgExtStep3}>
                                                    <MoreButton />
                                                </Trans>
                                            </li>
                                            <li>
                                                <Trans i18nKey={TransKeys.protoMsgExtStep4}>
                                                    <SaveStickersButton />
                                                </Trans>
                                            </li>
                                        </ol>
                                    }
                                    timestamp={t(TransKeys.protoMsgExtTime)}
                                />
                            ),
                            gutter,
                        },
                        {
                            key: "b",
                            message: (
                                <TeamsChatMessage
                                    author="NewFuture"
                                    data-is-focusable
                                    content={sticker}
                                    dialogContent={sticker}
                                    reactionGroup={reactions}
                                    timestamp={t(TransKeys.protoMsgExtTime)}
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

const TeamsChatMessage: React.FC<ChatMessageProps & { dialogContent: JSX.Element }> = (props) => {
    const [openFlag, setOpenFlag] = React.useState(false);
    const close = () => setOpenFlag(false);
    const open = () => setOpenFlag(true);
    const chatElement = React.useRef<any>(null);
    const popoverClose = () => {
        close();
        chatElement?.current?.focus();
    };
    const { dialogContent, ...rest } = props;
    const actionItems = useActionItems(open);
    return (
        <>
            {/* <Ref innerRef={setChatMessageElementWarpper}> */}
            <Chat.Message
                as="section"
                ref={chatElement}
                {...rest}
                actionMenu={{
                    iconOnly: true,
                    items: actionItems,
                }}
            />
            <Dialog
                open={openFlag}
                onOpen={open}
                onCancel={popoverClose}
                onConfirm={close}
                styles={{ width: "30em", textAlign: "center" }}
                content={{
                    styles: { width: "100%" },
                    content: dialogContent,
                }}
                header={<StickersSavedTitle />}
                headerAction={{
                    icon: <CloseIcon />,
                    title: "Close",
                    onClick: popoverClose,
                }}
            />
        </>
    );
};

export default ChatWithPopover;
