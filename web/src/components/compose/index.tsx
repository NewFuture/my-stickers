import BottomMenu from "./BottomMenu";
import React from "react";
import { Chat, Provider, TextArea } from "@stardust-ui/react";
import { ComponentPrototype, PrototypeSection } from "../Prototype";
import gutter from "../gutter";
// import Chat from '../chat';

const messages = [
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content="Now, you cand send the stickers"
                timestamp="Yesterday, 11:11 PM"
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<div>1. Click the ♥ icon</div>}
                timestamp="Yesterday, 11:11 PM"
            />
        ),
    },
    {
        gutter,
        message: (
            <Chat.Message
                author="New Future"
                content={<div>2. Click the sitcker that you want to send</div>}
                timestamp="Yesterday, 11:11 PM"
            />
        ),
    },
];
export default function Compose(props: any) {
    return (
        <PrototypeSection title="Send Stickers from compose extension">
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
