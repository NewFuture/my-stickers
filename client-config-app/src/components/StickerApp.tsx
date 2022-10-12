import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useState } from "react";
import type { UserType } from "../model/sticker";
import Header from "./Header/Header";
import { TenantImageList } from "./ImageList/TenantImageList";
import { UserImageList } from "./ImageList/UserImageList";

const useStyles = makeStyles({
    main: {
        flexGrow: 1,
        ...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke2),
        "&>.fui-Spinner": {
            minHeight: "100%",
        },
    },
});

export function StickerApp(): JSX.Element {
    const styles = useStyles();
    const [currentType, setCurrentType] = useState<UserType>("user");
    const isTenant = currentType === "company";
    return (
        <>
            <Header type={currentType} onTypeChange={setCurrentType} />
            <main className={styles.main}>{isTenant ? <TenantImageList /> : <UserImageList />}</main>
        </>
    );
}
