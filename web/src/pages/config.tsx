import React, { useEffect } from "react";
import ImageList from "../components/list/";
import { init } from "../services/teams";
import { Provider } from "react-redux";
import { store } from "../store";
import { getStickers } from "../services/stickers";
import HeaderBtns from "../components/header/headerBtns";

import { Divider } from "@stardust-ui/react";
import Footer from "../components/Footer";

export default function Config() {
    useEffect(() => {
        if(navigator.userAgent !== "ReactSnap"){
            init().then(getStickers,()=>console.error('Teams initialized error'));
        }
    }, []);
    return (
        <Provider store={store}>
            <HeaderBtns />
            <Divider />
            <ImageList />
            <Footer />
        </Provider>
    );
}
