import { makeStyles, Spinner } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteTenantSticker, patchTenantSticker, uploadTenantSticker } from "../../services/stickers";
import { getAuthToken } from "../../services/teams";
import { IsAdmin } from "../../utilities/RoleUtils";
import { LoginPage } from "../LoginPage/LoginPage";
import ImageList from "./ImageList";

const useStyles = makeStyles({
    loader: {
        height: "calc(100vh - 16px)",
    },
});
export function TenantImageList(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { data, isLoading, mutate, error } = useStickersList(true);
    const styles = useStyles();
    useEffect(() => {
        const getFocus = () => {
            getAuthToken().then(() => {});
        };
        window.addEventListener("focus", getFocus);
        return () => {
            window.removeEventListener("focus", getFocus);
        };
    }, []);
    useEffect(() => {
        getAuthToken().then(
            (token) => {
                const admin = IsAdmin(token);
                setIsAdmin(admin);
            },
            () => {
                setIsAdmin(false);
            },
        );
    }, []);
    return error ? (
        <LoginPage onLogin={(token: string) => {}} />
    ) : isLoading ? (
        <Spinner size="extra-large" className={styles.loader} />
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
