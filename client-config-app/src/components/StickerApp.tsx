import { Divider } from "@fluentui/react-components";
import { useState } from "react";
import { useStickersList } from "../services/stickers";
import Header, { StickersType } from "./Header/Header";
import ImageList from "./ImageList";

export function Sticker(): JSX.Element {
    const [currentRadio, setCurrentRadio] = useState<StickersType>("user");
    const isTenant = currentRadio === "company";
    const { stickers, isLoading } = useStickersList(isTenant);

    return (
        <>
            <Header type={currentRadio} onRadioChange={setCurrentRadio} />
            <Divider />
            <ImageList loading={isLoading} stickes={stickers} isTenant={isTenant} />
        </>
    );
}
