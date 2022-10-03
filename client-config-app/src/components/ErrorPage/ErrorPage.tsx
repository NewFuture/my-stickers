import { useMemo } from "react";
import { Text } from "@fluentui/react-components";
import { ShieldErrorRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { isUnauthorizedError } from "../../hooks/useStickersList";
import { TransKeys } from "../../locales";
import { useLoginPageStyles } from "../LoginPage/LoginPage.styles";

export function ErrorPage({ error }: { error: any }) {
    const styles = useLoginPageStyles();
    const { t } = useTranslation();
    const message = useMemo(() => {
        const isUnauthorized = isUnauthorizedError(error);
        return t(TransKeys.error, { context: isUnauthorized ? "expire" : "", message: error });
    }, [error, t]);
    return (
        <div className={styles.root}>
            <ShieldErrorRegular className={styles.img} />
            <Text className={styles.desc} wrap>
                {message}
            </Text>
        </div>
    );
}
