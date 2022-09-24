import { teamsDarkTheme, teamsHighContrastTheme, teamsLightTheme, Theme } from "@fluentui/react-components";
import { authentication, app } from "@microsoft/teams-js";

app.initialize().then(
    () => {
        console.debug("teams initialized");
    },
    () => {
        console.error("teams not initialize");
    },
);

export function getAuthToken(): Promise<string> {
    return authentication.getAuthToken({ silent: false });
}

export function getContext() {
    return app.getContext();
}
export function registerOnThemeChangeHandler(handler: (theme: Theme) => void) {
    return app.registerOnThemeChangeHandler((theme) => handler(getTeamsTheme(theme)));
}

export function getTeamsTheme(themeName: string) {
    return themeName === "dark" ? teamsDarkTheme : themeName === "contrast" ? teamsHighContrastTheme : teamsLightTheme;
}
