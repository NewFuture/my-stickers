import { Spinner } from "@fluentui/react-components";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteSticker, patchSticker, uploadSticker } from "../../services/stickers";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { LinearSpinner } from "../LinearSpinner/LinearSpinner";
import ImageList from "./ImageList";

export function UserImageList(): JSX.Element {
    const { data, isLoading, mutate, isValidating, error } = useStickersList(false);
    return isLoading ? (
        <Spinner size="extra-large" />
    ) : error ? (
        <ErrorPage error={error} />
    ) : (
        <>
            <LinearSpinner hidden={!isValidating} />
            <ImageList
                items={data!}
                onMutate={mutate}
                enableUpload
                enableEdit={!isValidating}
                onDelete={deleteSticker}
                onPatch={patchSticker}
                onUpload={uploadSticker}
            />
        </>
    );
}
