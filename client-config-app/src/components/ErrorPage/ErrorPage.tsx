import { Text } from "@fluentui/react-components";
import { ErrorCircleRegular, SignOutRegular, WifiWarningFilled } from "@fluentui/react-icons";
import axios from "axios";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { useLoginPageStyles } from "../LoginPage/LoginPage.styles";

const enum Err {
    EXPIRE = "EXPIRE",
    NETWORK = "NETWORK",
    UNKOWN = "UNKOWN",
}
export function ErrorPage({ error }: { error: any }) {
    const styles = useLoginPageStyles();
    const { t } = useTranslation();
    const errorType = useMemo(() => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                return Err.EXPIRE;
            } else if (error.code === axios.AxiosError.ERR_NETWORK || error.code === axios.AxiosError.ETIMEDOUT) {
                return Err.NETWORK;
            }
        }
        return Err.UNKOWN;
    }, [error]);
    console.log(errorType, error);
    return (
        <div className={styles.root}>
            {errorType === Err.EXPIRE ? (
                <SignOutRegular className={styles.img} />
            ) : errorType === Err.NETWORK ? (
                <WifiWarningFilled className={styles.img} />
            ) : (
                <ErrorCircleRegular className={styles.img} />
            )}
            <Text className={styles.desc} size={500} wrap>
                {t(TransKeys.error, { context: errorType, message: error })}
            </Text>
        </div>
    );
}
