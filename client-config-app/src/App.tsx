import React, { useEffect } from "react";
import { FluentProvider, Divider, teamsLightTheme } from "@fluentui/react-components";
import ImageList from "./list";
import { init } from "./services/teams";
import { useStickersList } from "./services/stickers";
import HeaderBtns from "./header/headerBtns";
import "./lib/i18n";
import { SWRConfig } from "swr";

function Sticker({ isTenant }: React.PropsWithChildren<{ isTenant: boolean }>): JSX.Element {
    const { stickers, isLoading } = useStickersList(isTenant);
    return (
        <>
            <HeaderBtns disabled={isLoading} />
            <Divider />
            <ImageList loading={isLoading} stickes={stickers} />
        </>
    );
}

export default function ConfigApp() {
    useEffect(() => {
        init();
    }, []);
    return (
        <FluentProvider theme={teamsLightTheme}>
            <SWRConfig>
                <Sticker isTenant={false} />
            </SWRConfig>
        </FluentProvider>
    );
}
