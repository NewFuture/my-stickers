import {
    Chat,
    Provider,
    Avatar,
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

const janeAvatar = {
    image: 'https://avatars1.githubusercontent.com/u/6290356?s=64',
    status: { color: 'green', icon: 'check' },
}

const ChatWithPopover: React.FC = () => {
    return (
        <Provider
            theme={{
                componentStyles: {
                    ChatMessage: {
                        root: (opts: any) => ({
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
                items={[
                    {
                        key: 'a',
                        message: (
                            <Chat.Message
                                author="New Future"
                                content={<ol>
                                    <li>Hover or tap the next message</li>
                                    <li>Click the <Icon name="more" />(the right one of the reaction list)</li>
                                    <li>Click <code>More Actions ></code>(the last one in the menu list)</li>
                                    <li>Click <code>♥ Save Stickers</code></li>
                                </ol>}
                                timestamp="Yesterday, 10:15 PM"
                            />
                        ),
                        gutter: <Avatar {...janeAvatar} />,
                    },
                    {
                        key: 'b',
                        message: (
                            <TeamsChatMessage
                                author="New Future"
                                data-is-focusable
                                content={
                                    <Image src={helloSticker} />
                                }
                                reactionGroup={{
                                    items: reactionsWithPopup,
                                }}
                                timestamp="Yesterday, 10:16 PM"
                            />
                        ),
                        gutter: <Avatar {...janeAvatar} />,
                    },
                ]}
            />
        </Provider>
    )
}

const TeamsChatMessage: React.FC<ChatMessageProps> = (props: ChatMessageProps) => {
    const [showActionMenu, setShowActionMenu] = React.useState(false)
    const [forceShowActionMenu, setForceShowActionMenu] = React.useState(false)
    const [chatMessageElement, setChatMessageElement] = React.useState<HTMLElement>()

    const handleBlur = (e: any) => !e.currentTarget.contains(e.relatedTarget) && setShowActionMenu(false)

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