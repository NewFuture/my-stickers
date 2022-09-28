import { Divider, makeStyles } from "@fluentui/react-components";
import { useState } from "react";
import type { UserType } from "../model/sticker";
import Header from "./Header/Header";
import { TenantImageList } from "./ImageList/TenantImageList";
import { UserImageList } from "./ImageList/UserImageList";

const useStyles = makeStyles({
    content: {
        minHeight: "calc(100vh - 64px)",
        "&>.fui-Spinner": {
            minHeight: "calc(100vh - 64px)",
        },
    },
});

export function StickerApp(): JSX.Element {
    const styles = useStyles();
    const [currentRadio, setCurrentRadio] = useState<UserType>("user");
    const isTenant = currentRadio === "company";
    return (
        <>
            <Header type={currentRadio} onRadioChange={setCurrentRadio} />
            <Divider />
            <main className={styles.content}>{isTenant ? <TenantImageList /> : <UserImageList />}</main>
        </>
    );
}
