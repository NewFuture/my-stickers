import { Spinner } from "@fluentui/react-components";
import { useCallback, useEffect, useState } from "react";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteTenantSticker, patchTenantSticker, uploadTenantSticker } from "../../services/stickers";
import { getAuthToken } from "../../services/teams";
import { IsAdmin } from "../../utilities/isAdmin";
import { LoginPage } from "../LoginPage/LoginPage";
import ImageList from "./ImageList";

export function TenantImageList(): JSX.Element {
    const { data, isLoading, mutate, error } = useStickersList(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        getAuthToken().then(
            (token) => setIsAdmin(IsAdmin(token)),
            () => setIsAdmin(false),
        );
    }, []);
    const onLogin = useCallback((token: string) => setIsAdmin(IsAdmin(token)), []);

    // todo detect the error type
    const isUnAuthorized = !!error;
    return isUnAuthorized ? (
        <LoginPage onLogin={onLogin} />
    ) : isLoading ? (
        <Spinner size="extra-large" />
    ) : (
        <ImageList
            items={data!}
            onMutate={mutate}
            isEditable={isAdmin}
            onDelete={deleteTenantSticker}
            onPatch={patchTenantSticker}
            onUpload={uploadTenantSticker}
        />
    );
}
