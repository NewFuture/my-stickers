import "./lib/i18n";

import React, { useEffect, useState } from "react";
import { FluentProvider, Divider, teamsLightTheme } from "@fluentui/react-components";
import { getAuthToken, init } from "./services/teams";
import { SWRConfig } from "swr";
import { Sticker } from "./components/StickerApp";

export default function ConfigApp() {
    useEffect(() => {
        init();
    }, []);
    return (
        <FluentProvider theme={teamsLightTheme}>
            <SWRConfig>
                <Sticker />
            </SWRConfig>
        </FluentProvider>
    );
}
