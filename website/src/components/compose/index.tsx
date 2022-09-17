import React from "react";
import { useTranslation } from "react-i18next";

import { PrototypeComponent, PrototypeSection } from "../Prototype";
import { NS, HomePage } from "../../locales";
import { ComposeChat } from "./ComposeChat";

export default function Compose(props: React.PropsWithChildren<{}>) {
    const { t } = useTranslation([NS.homePage]);
    return (
        <PrototypeSection title={t(HomePage.protoComposeTitle)}>
            <PrototypeComponent
                title={t(HomePage.protoComposeSubTitle)}
                // description="Click save stciker in the more action menu list can save it!"
            >
                <ComposeChat />
            </PrototypeComponent>
        </PrototypeSection>
    );
}
