import {
    Chat,
    Provider,
    ChatMessageProps,
    ShorthandCollection,
    ReactionProps,
    Image,
    Reaction,
    Icon,
} from '@stardust-ui/react'
import React from 'react'
import Popover from './Popover'
// import ReactionPopup from './ReactionPopup'
import { Ref } from '@stardust-ui/react-component-ref'
import gutter from '../gutter';

const helloSticker = process.env.PUBLIC_URL + '/hello.gif';

const reactions: ShorthandCollection<ReactionProps> = [
    {
        icon: 'like',
        content: 2333,
        key: 'likes',
        variables: { meReacting: true },
    },
    // {
    //     icon: 'emoji',
    //     content: 666,
    //     key: 'smiles',
    // },
]

const reactionsWithPopup = reactions.map(reaction => (render: any) =>
    render(reaction, (_: any, props: any) => <Reaction {...props} />),
)

const ChatWithPopover: React.FC = () => {
    return (
        <Provider
            theme={{
                componentStyles: {
                    ChatMessage: {
                        root: (opts: any) => ({
                            marginBottom: "2em",
                            '& a': {
                                color: opts.theme.siteVariables.colors.brand[600],
                            },
                        }),
                    },
                    Menu: {
                        root: {
                            background: '#fff',
                            transition: 'opacity 0.2s',
                            position: 'absolute',

                            '& a:focus': {
                                textDecoration: 'none',
                                color: 'inherit',
                            },
                            '& a': {
                                color: 'inherit',
                            },

                            '& .smile-emoji': {
                                position: 'absolute',
                                opacity: 0,
                                zIndex: -1,
                            },

                            '&.focused .smile-emoji': {
                                position: 'initial',
                                zIndex: 'initial',
                                opacity: 1,
                            },

                            '&:hover .smile-emoji': {
                                position: 'initial',
                                zIndex: 'initial',
                                opacity: 1,
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
                    maxWidth: '1366px'
                }}
                items={[
                    {
                        key: 'a',
                        message: (
                            <Chat.Message
                                author="New Future"
                                content={<ol>
                                    <li>Click or hover on the next message</li>
                                    <li>Click the <Icon name="more" /> (the right one of the reaction list)</li>
                                    <li>Click <b>More actions > </b> (the last one in the menu list)</li>
                                    <li>Click <b>♥ Save Stickers</b></li>
                                </ol>}
                                timestamp="Yesterday, 10:15 PM"
                            />
                        ),
                        gutter,
                    },
                    {
                        key: 'b',
                        message: (
                            <TeamsChatMessage
                                author="New Future"
                                data-is-focusable
                                content={<Image src={helloSticker} />}
                                dialogContent={<Image src={helloSticker} />}
                                reactionGroup={{
                                    items: reactionsWithPopup,
                                }}
                                timestamp="Yesterday, 10:16 PM"
                            />

                        ),
                        gutter,
                    },
                ]}
            />
        </Provider>
    )
}

const TeamsChatMessage: React.FC<ChatMessageProps & { dialogContent: JSX.Element }> = (props) => {
    const [showActionMenu, setShowActionMenu] = React.useState(false)
    const [forceShowActionMenu, setForceShowActionMenu] = React.useState(false)
    const [chatMessageElement, setChatMessageElement] = React.useState<HTMLElement>()

    const handleBlur = (e: any) => !e.currentTarget.contains(e.relatedTarget) && setShowActionMenu(false)
    const { dialogContent } = props;

    return (
        <Ref innerRef={setChatMessageElement}>
            <Chat.Message
                as="section"
                {...props}
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
    )
}

export default ChatWithPopover