import { makeStyles, Spinner } from "@fluentui/react-components";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteSticker, patchSticker } from "../../services/stickers";
import ImageList from "./ImageList";

const useStyles = makeStyles({
    loader: {
        height: "calc(100vh - 16px)",
    },
});
export function UserImageList(): JSX.Element {
    const { data, isLoading, mutate } = useStickersList(false);
    const styles = useStyles();
    return isLoading ? (
        <Spinner size="extra-large" className={styles.loader} />
    ) : <ImageList items={data!} onMutate={mutate} isEditable={true} onDelete={deleteSticker} onPatch={patchSticker} />
}
