import { useEffect } from "react";
import { FluentProvider, Divider, teamsLightTheme } from "@fluentui/react-components";
import { Provider } from "react-redux";
import ImageList from "./list";
import { init } from "./services/teams";
import { store } from "./lib/store";
import { getStickers } from "./services/stickers";
import HeaderBtns from "./header/headerBtns";
import "./lib/i18n";

export default function ConfigApp() {
    useEffect(() => {
        if (navigator.userAgent !== "ReactSnap") {
            init().then(getStickers, () => console.error("Teams initialized error"));
        }
    }, []);
    return (
        <FluentProvider theme={teamsLightTheme}>
            <Provider store={store}>
                <HeaderBtns />
                <Divider />
                <ImageList />
            </Provider>
        </FluentProvider>
    );
}
