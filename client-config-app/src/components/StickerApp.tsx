import { Divider } from "@fluentui/react-components";
import { useState } from "react";
import { useStickersList } from "../services/stickers";
import { UserType } from "../model/sticker";

import Header from "./Header/Header";
import ImageList from "./ImageList";

export function Sticker(): JSX.Element {
    const [currentRadio, setCurrentRadio] = useState<UserType>("user");
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
