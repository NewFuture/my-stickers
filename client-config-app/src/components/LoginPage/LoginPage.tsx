import React, { useEffect, useState } from "react";
import { Button, Text, Image } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useWelcomePageStyles } from "./LoginPage.styles";
import { TransKeys } from "../../locales";
import { getContext } from "../../services/teams";
import LoginPic from "../../assets/LoginPagePic.png";
import { AAD_ID } from "../../lib/env";

interface WelcomePageProps {
    onLogin: (token: string) => void;
}

export const LoginPage: React.FC<WelcomePageProps> = (props) => {
    const { t } = useTranslation();
    const styles = useWelcomePageStyles();
    const [link, setLink] = useState<string>();
    useEffect(() => {
        getContext().then((c) => {
            const tenantId = c.user?.tenant?.id;
            // const link = `https://admin.teams.microsoft.com/policies/manage-apps/${AAD_ID}/permission`;
            const link = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${AAD_ID}&scope=openid profile offline_access`;
            setLink(link);
        });
    }, []);
    return (
        <div className={styles.root}>
            <Image className={styles.img} src={LoginPic} />
            <div className={styles.description}>
                <Text>{t(TransKeys.loginDescription)}</Text>
            </div>
            <Button appearance="primary" as="a" disabled={!link} href={link} target="_blank">
                {t(TransKeys.login)}
            </Button>
        </div>
    );
};
