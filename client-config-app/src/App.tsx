import React, { useEffect, useState } from "react";
import { FluentProvider, Divider, teamsLightTheme } from "@fluentui/react-components";
import ImageList from "./list";
import { getAuthToken, init } from "./services/teams";
import { useStickersList } from "./services/stickers";
import HeaderBtns from "./header/headerBtns";
import "./lib/i18n";
import { SWRConfig } from "swr";

function Sticker(): JSX.Element {
    const [currentRadio, setCurrentRadio] = useState<string>("Personal");
    const isTenant = currentRadio === "Tenant";
    const { stickers, isLoading } = useStickersList(isTenant);

    return (
        <>
            <HeaderBtns radio={currentRadio} onRadioChange={setCurrentRadio} />
            <Divider />
            <ImageList loading={isLoading} stickes={stickers} isTenant={isTenant} />
        </>
    );
}

export default function ConfigApp() {
    useEffect(() => {
        init();
        getAuthToken().then((token) => {
            console.log("token", token);
        });
    }, []);
    return (
        <FluentProvider theme={teamsLightTheme}>
            <SWRConfig>
                <Sticker />
            </SWRConfig>
        </FluentProvider>
    );
}
