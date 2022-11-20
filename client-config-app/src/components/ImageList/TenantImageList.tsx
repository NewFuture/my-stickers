import { Spinner } from "@fluentui/react-components";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteTenantSticker, patchTenantSticker, uploadTenantSticker } from "../../services/stickers";
import { getAuthToken } from "../../services/teams";
import { IsAdmin } from "../../utilities/isAdmin";
import { EmptyPage } from "../EmptyPage/EmptyPage";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { LinearSpinner } from "../LinearSpinner/LinearSpinner";
import { LoginPage } from "../LoginPage/LoginPage";
import ImageList from "./ImageList";

let isAdminState = false;

export function TenantImageList(): JSX.Element {
    const { data, isLoading, isValidating, mutate, error } = useStickersList(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(isAdminState);

    useEffect(() => {
        getAuthToken().then(
            (token) => setIsAdmin((isAdminState = IsAdmin(token))),
            () => setIsAdmin(false),
        );
    }, []);
    const onLogin = useCallback((token: string) => setIsAdmin(IsAdmin(token)), []);

    const needLogin = error && !axios.isAxiosError(error);
    return needLogin ? (
        <LoginPage onLogin={onLogin} />
    ) : isLoading ? (
        <Spinner size="extra-large" />
    ) : error ? (
        <ErrorPage error={error} />
    ) : data?.length || isAdmin ? (
        <>
            <LinearSpinner hidden={!isValidating} />
            <ImageList
                items={data!}
                onMutate={mutate}
                enableUpload={isAdmin}
                enableEdit={isAdmin && !isValidating}
                onDelete={deleteTenantSticker}
                onPatch={patchTenantSticker}
                onUpload={uploadTenantSticker}
            />
        </>
    ) : (
        <EmptyPage />
    );
}
