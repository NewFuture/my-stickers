import { Divider, makeStyles, Spinner } from "@fluentui/react-components";
import { useState } from "react";

import type { UserType } from "../model/sticker";
import { useStickersList } from "../hooks/useStickersList";
import Header from "./Header/Header";
import ImageList from "./ImageList";
import { deleteSticker, patchSticker } from "../services/stickers";

const useAppStyles = makeStyles({
    loader: {
        height: "calc(100vh - 16px)",
    },
});
export function StickerApp(): JSX.Element {
    const [currentRadio, setCurrentRadio] = useState<UserType>("user");
    const isTenant = currentRadio === "company";
    const { data, isLoading, mutate } = useStickersList(isTenant);
    const styles = useAppStyles();
    return isLoading ? (
        <Spinner size="extra-large" className={styles.loader} />
    ) : (
        <>
            <Header type={currentRadio} onRadioChange={setCurrentRadio} />
            <Divider />
            <ImageList items={data!} onMutate={mutate} isEditable={isTenant} onDelete={deleteSticker} onPatch={patchSticker} />
        </>
    );
}
