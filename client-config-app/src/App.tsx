import i18n from "./lib/i18n";

import { useEffect, useState } from "react";
import { FluentProvider, teamsDarkTheme, teamsHighContrastTheme, teamsLightTheme } from "@fluentui/react-components";
import { getContext } from "./services/teams";
import { SWRConfig } from "swr";
import { Sticker } from "./components/StickerApp";

function getTeamsTheme(themeName: string) {
    return themeName === "dark" ? teamsDarkTheme : themeName === "contrast" ? teamsHighContrastTheme : teamsLightTheme;
}
export default function ConfigApp() {
    const [theme, setTheme] = useState(teamsLightTheme);
    useEffect(() => {
        getContext().then((c) => {
            i18n.changeLanguage(c.app.locale);
            setTheme(getTeamsTheme(c.app.theme));
        });
    }, []);
    return (
        <FluentProvider theme={theme}>
            <SWRConfig>
                <Sticker />
            </SWRConfig>
        </FluentProvider>
    );
}
