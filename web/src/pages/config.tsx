import React, { useEffect } from "react";
import ImageList from "../components/list/";
import { init } from "../services/teams";
import { Provider } from "react-redux";
import { store } from "../store";
import { getStickers } from "../services/stickers";
import HeaderBtns from "../components/header/headerBtns";

import { Provider as TeamsProvider, themes } from "@stardust-ui/react";

export default function Config() {
    useEffect(() => {
        init().then(getStickers);
    }, []);
    return (
        <TeamsProvider theme={themes.teams}>
            <Provider store={store}>
                <HeaderBtns />
                <ImageList />
            </Provider>
        </TeamsProvider>
    );
}
