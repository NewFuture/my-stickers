import React, { useEffect } from "react";
import ImageList from "../components/list/";
import { init } from "../services/teams";
import { Provider } from "react-redux";
// import reducer from "../reducer";
import { store } from "../store";
import { getStickers } from "../services/stickers";
import HeaderBtns from "../components/header/headerBtns";

export default function Config() {
    useEffect(() => {
        init().then(getStickers);
    }, []);
    return (
        <Provider store={store}>
            <HeaderBtns />
            <ImageList />
        </Provider>
    );
}
