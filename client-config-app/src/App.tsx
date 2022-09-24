import i18n from "./lib/i18n";
import { useEffect, useState } from "react";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { getContext, getTeamsTheme, registerOnThemeChangeHandler } from "./services/teams";
import { StickerApp } from "./components/StickerApp";

export default function ConfigApp() {
    const [theme, setTheme] = useState(teamsLightTheme);
    useEffect(() => {
        getContext().then((c) => {
            i18n.changeLanguage(c.app.locale);
            setTheme(getTeamsTheme(c.app.theme));
        });
        registerOnThemeChangeHandler(setTheme);
    }, []);
    return (
        <FluentProvider theme={theme}>
            <StickerApp />
        </FluentProvider>
    );
}
