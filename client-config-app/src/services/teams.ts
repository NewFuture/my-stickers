import { teamsDarkTheme, teamsHighContrastTheme, teamsLightTheme, Theme } from "@fluentui/react-components";
import { authentication, app } from "@microsoft/teams-js";

app.initialize().then(
    () => {
        console.debug("teams initialized");
    },
    () => {
        if (process.env.NODE_ENV === "production") {
            console.error("teams not initialize");
        }
    },
);

export const getAuthToken = authentication.getAuthToken;

export const getContext = app.getContext;

export function registerOnThemeChangeHandler(handler: (theme: Theme) => void) {
    return app.registerOnThemeChangeHandler((theme) => handler(getTeamsTheme(theme)));
}

export function getTeamsTheme(themeName: string) {
    return themeName === "dark" ? teamsDarkTheme : themeName === "contrast" ? teamsHighContrastTheme : teamsLightTheme;
}
