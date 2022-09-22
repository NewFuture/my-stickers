import { Divider } from "@fluentui/react-components";
import { useState } from "react";
import { useStickersList } from "../services/stickers";
import HeaderBtns from "./header/headerBtns";
import ImageList from "./ImageList";

export function Sticker(): JSX.Element {
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
