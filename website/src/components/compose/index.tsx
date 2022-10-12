import React from "react";
import { useTranslation } from "react-i18next";

import { PrototypeComponent, PrototypeSection } from "../Prototype";
import { TransKeys } from "../../locales";
import { ComposeChat } from "./ComposeChat";

export default function Compose(props: React.PropsWithChildren<{}>) {
    const { t } = useTranslation();
    return (
        <PrototypeSection title={t(TransKeys.protoComposeTitle)}>
            <PrototypeComponent
                title={t(TransKeys.protoComposeSubTitle)}
                // description="Click save stciker in the more action menu list can save it!"
            >
                <ComposeChat />
            </PrototypeComponent>
        </PrototypeSection>
    );
}
