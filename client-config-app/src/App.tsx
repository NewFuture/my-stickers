import i18n from "./common/i18n";
import { useEffect, useState } from "react";
import { FluentProvider } from "@fluentui/react-components";
import { getContext, getTeamsTheme, registerOnThemeChangeHandler } from "./services/teams";
import { StickerApp } from "./components/StickerApp";
import { INIT_QUERY } from "./common/env";

export default function ConfigApp() {
    const [theme, setTheme] = useState(() => getTeamsTheme(INIT_QUERY.get("theme")!));
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
