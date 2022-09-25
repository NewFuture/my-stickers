import { makeStyles, Spinner } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useStickersList } from "../../hooks/useStickersList";
import { deleteTenantSticker, patchTenantSticker } from "../../services/stickers";
import { getAuthToken } from "../../services/teams";
import { IsAdmin } from "../../utilities/RoleUtils";
import { WelcomePage } from "../WelcomePage/WelcomePage";
import ImageList from "./ImageList";

const useStyles = makeStyles({
    loader: {
        height: "calc(100vh - 16px)",
    },
});
export function TenantImageList(): JSX.Element {
    const [idToken, setIdToken] = useState<string>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { data, isLoading, mutate } = useStickersList(true);
    const styles = useStyles();
    useEffect(() => {
        getAuthToken().then(
            (token) => {
                setIdToken(token);
                const admin = IsAdmin(token);
                setIsAdmin(admin);
            },
            () => {
                setIsAdmin(false);
            },
        );
    }, []);
    return !idToken ?
        <WelcomePage onLogin={(token: string) => {
            setIdToken(token);
        }} />
        : isLoading ? (
            <Spinner size="extra-large" className={styles.loader} />
        ) :
            (
                <ImageList items={data!} onMutate={mutate} isEditable={isAdmin} onDelete={deleteTenantSticker} onPatch={patchTenantSticker} />
            );
}
