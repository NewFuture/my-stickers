import { Text } from "@fluentui/react-components";
import { ImageAddRegular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { useLoginPageStyles } from "../LoginPage/LoginPage.styles";

export function EmptyPage() {
    const styles = useLoginPageStyles();
    const { t } = useTranslation();
    return (
        <div className={styles.root}>
            <ImageAddRegular className={styles.img} />
            <Text align="center" className={styles.desc} size={500} wrap>
                {t(TransKeys.tenantsEmptyTips)}
            </Text>
        </div>
    );
}
