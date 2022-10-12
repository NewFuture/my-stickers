import ChatWithPopover from "./ChatWithPopover";
import { useTranslation } from "react-i18next";

import { PrototypeComponent, PrototypeSection } from "../Prototype";
import { TransKeys } from "../../locales";

export default function ChatMessage(props: any) {
    const { t } = useTranslation();
    return (
        <PrototypeSection title={t(TransKeys.protoMsgExtTitle)}>
            <PrototypeComponent
                title={t(TransKeys.protoMsgExtSubTitle)}
                // description="Click save stciker in the more action menu list can save it!"
            >
                <ChatWithPopover />
            </PrototypeComponent>
        </PrototypeSection>
    );
}
