import React from "react";
import { Provider, TextArea } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { ComponentPrototype, PrototypeSection } from "../Prototype";
import { NS, HomePage } from "../../locales";
import { MessageProvider } from "./useMessages";
import { ChatList } from "./ChatList";
import BottomMenu from "./BottomMenu";

export default function Compose(props: React.Props<{}>) {
    const { t } = useTranslation([NS.homePage]);
    return (
        <PrototypeSection title={t(HomePage.protoComposeTitle)}>
            <ComponentPrototype
                title={t(HomePage.protoComposeSubTitle)}
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
                    <MessageProvider>
                        <ChatList />
                        <TextArea
                            // fluid={true}
                            disabled
                            variables={{ height: "3em" }}
                            styles={{ margin: "0.5em 0", width: "100%" }}
                            placeholder="using compose extensions to send messages"
                        />
                        <BottomMenu />
                    </MessageProvider>
                </Provider>
            </ComponentPrototype>
        </PrototypeSection>
    );
}
