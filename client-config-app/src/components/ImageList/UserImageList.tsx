import { Spinner } from "@fluentui/react-components";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteSticker, patchSticker, uploadSticker } from "../../services/stickers";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import ImageList from "./ImageList";

export function UserImageList(): JSX.Element {
    const { data, isLoading, mutate, error } = useStickersList(false);
    return isLoading ? (
        <Spinner size="extra-large" />
    ) : error ? (
        <ErrorPage error={error} />
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
