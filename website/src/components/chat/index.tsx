import ChatWithPopover from "./ChatWithPopover";
import React from "react";
import { useTranslation } from "react-i18next";

import { PrototypeComponent, PrototypeSection } from "../Prototype";
import { HomePage, NS } from "../../locales";

export default function ChatMessage(props: any) {
    const { t } = useTranslation([NS.common, NS.homePage]);
    return (
        <PrototypeSection title={t(HomePage.protoMsgExtTitle)}>
            <PrototypeComponent
                title={t(HomePage.protoMsgExtSubTitle)}
                // description="Click save stciker in the more action menu list can save it!"
            >
                <ChatWithPopover />
            </PrototypeComponent>
        </PrototypeSection>
    );
}
