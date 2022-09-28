import { Spinner } from "@fluentui/react-components";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteSticker, patchSticker, uploadSticker } from "../../services/stickers";
import ImageList from "./ImageList";

export function UserImageList(): JSX.Element {
    const { data, isLoading, mutate } = useStickersList(false);
    return isLoading ? (
        <Spinner size="extra-large" />
    ) : (
        <ImageList
            items={data!}
            onMutate={mutate}
            isEditable={true}
            onDelete={deleteSticker}
            onPatch={patchSticker}
            onUpload={uploadSticker}
        />
    );
}
