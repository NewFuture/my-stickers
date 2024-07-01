import { useEffect, useState } from "react";
import { Spinner } from "@fluentui/react-components";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteSticker, patchSticker, uploadSticker } from "../../services/stickers";
import { Err, ErrorPage } from "../ErrorPage/ErrorPage";
import { LinearSpinner } from "../LinearSpinner/LinearSpinner";
import ImageList from "./ImageList";
import { getContext } from "../../services/teams";
import config from "../../config.json";

export function UserImageList(): JSX.Element {
    const { data, isLoading, mutate, isValidating, error } = useStickersList(false);
    const [enableUpload, setEnableUpload] = useState(true);
    useEffect(() => {
        getContext().then((c) => {
            const tid = c.user?.tenant?.id?.toLowerCase();
            if (config.UploadBlockedTenants.includes(tid!)) {
                setEnableUpload(false);
            }
        });
    });
    return isLoading ? (
        <Spinner size="extra-large" />
    ) : error ? (
        <ErrorPage error={error} />
    ) : enableUpload || data?.length! > 0 ? (
        <>
            <LinearSpinner hidden={!isValidating} />
            <ImageList
                items={data!}
                onMutate={mutate}
                enableUpload={enableUpload}
                enableEdit={!isValidating}
                onDelete={deleteSticker}
                onPatch={patchSticker}
                onUpload={uploadSticker}
            />
        </>
    ) : (
        <ErrorPage error={Err.BLOCKED} />
    );
}
