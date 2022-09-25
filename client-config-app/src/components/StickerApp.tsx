import { Divider } from "@fluentui/react-components";
import { useState } from "react";
import type { UserType } from "../model/sticker";
import Header from "./Header/Header";
import { TenantImageList } from "./ImageList/TenantImageList";
import { UserImageList } from "./ImageList/UserImageList";

export function StickerApp(): JSX.Element {
    const [currentRadio, setCurrentRadio] = useState<UserType>("user");
    const isTenant = currentRadio === "company";
    return (
        <>
            <Header type={currentRadio} onRadioChange={setCurrentRadio} />
            <Divider />
            {isTenant ? <TenantImageList /> : <UserImageList />}
        </>
    );
}
