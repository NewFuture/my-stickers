import BottomMenu from './BottomMenu';
import React from 'react';
import { ComponentPrototype, PrototypeSection } from '../Prototype';
import { Chat, Provider, TextArea, Box } from '@stardust-ui/react';
import gutter from '../gutter';
// import Chat from '../chat';

export default function Compose(props: any) {
    return (
        <PrototypeSection {...props} title="Send Stickers from compose extension">
            <ComponentPrototype
                title="Componse editor with popover"
            // description="Click save stciker in the more action menu list can save it!"
            >
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
                        }
                    }}>
                    <Chat
                        items={[
                            {
                                key: 1,
                                gutter,
                                message: <Chat.Message
                                    author="New Future"
                                    content="Now, you cand send the stickers"
                                    timestamp="Yesterday, 11:11 PM"
                                />,
                            },
                            {
                                key: 1,
                                gutter,
                                message: <Chat.Message
                                    author="New Future"
                                    content={<div>1. Click the ♥ icon</div>}
                                    timestamp="Yesterday, 11:11 PM"
                                />,
                            },
                            {
                                key: 1,
                                gutter,
                                message: <Chat.Message
                                    author="New Future"
                                    content={<div>2. Click the sitcker that you want to send</div>}
                                    timestamp="Yesterday, 11:11 PM"
                                />,
                            }
                        ]} />
                    <Box >
                        <TextArea disabled styles={{ border: "1px solid #eee", margin: "0.5em 0" }} defaultValue="using compose extensions to send messages" fluid />
                    </Box>
                    <BottomMenu />
                </Provider>
            </ComponentPrototype>
        </PrototypeSection>
    )
}
