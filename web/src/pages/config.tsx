import React, { useEffect } from "react";
import { Button, List, Header } from "@stardust-ui/react";
import ImageList from "../components/list/";
import UploadButton from "../components/upload-button";
import { NS, ConfigPage } from "../locales";
import { exit, init } from "../services/teams";
import { useTranslation } from "react-i18next";
import LanguageButton from "../components/language";
// import { createStore } from "redux";
import { Provider } from "react-redux";
// import reducer from "../reducer";
import { store } from "../store";
import { getStickers } from "../services/stickers";
// const store = createStore<>(reducer);

export default function Config() {
    const { t } = useTranslation(NS.configPage);
    useEffect(() => {
        init().then(getStickers);
    }, []);

    return (
        <Provider store={store}>
            <Header>
                <List
                    items={[
                        <Button icon="accept" key="exit" primary iconOnly circular onClick={() => exit()} />,
                        <UploadButton key="upload" multiple>
                            {t(ConfigPage.upload)}
                        </UploadButton>,
                        <Button
                            icon="trash-can"
                            iconPosition="before"
                            secondary
                            key="delete"
                            content={t(ConfigPage.delete)}
                        />,
                        <LanguageButton key="lang" styles={{ display: "block" }} />,
                    ]}
                    horizontal
                />
            </Header>
            <ImageList />
        </Provider>
    );
}
