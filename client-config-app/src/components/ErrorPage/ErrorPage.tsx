import { isUnauthorizedError } from "../../hooks/useStickersList";

export function ErrorPage({ error }: { error: any }) {
    const isUnauthorized = isUnauthorizedError(error);
    return isUnauthorized ? (
        <p>The session expires. Please reopen this page.</p>
    ) : (
        <p>Something went wrong: {error?.message}</p>
    );
}
