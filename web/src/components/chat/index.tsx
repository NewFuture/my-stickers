import ChatWithPopover from './ChatWithPopover';
import React from 'react';
import { ComponentPrototype, PrototypeSection } from '../Prototype';

export default function ChatMessage(props: any) {
    return (
        <PrototypeSection {...props} title="Save Images as Stickers from chat messages">
            <ComponentPrototype
                title="Chat message with popover and reactions"
            // description="Click save stciker in the more action menu list can save it!"
            >
                <ChatWithPopover />
            </ComponentPrototype>
        </PrototypeSection>
    )
}
