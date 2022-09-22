import "./lib/i18n";

import { useEffect } from "react";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { init } from "./services/teams";
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
