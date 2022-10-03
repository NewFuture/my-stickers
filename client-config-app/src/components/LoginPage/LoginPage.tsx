import React, { useEffect, useState } from "react";
import { Button, Text, Image } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useLoginPageStyles } from "./LoginPage.styles";
import { TransKeys } from "../../locales";
import { getAuthToken, getContext } from "../../services/teams";
import { AAD_ID } from "../../lib/env";
import { PersonAccountsFilled, ShieldKeyholeRegular } from "@fluentui/react-icons";

interface LoginPageProps {
    onLogin: (token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { t } = useTranslation();
    const styles = useLoginPageStyles();
    const [link, setLink] = useState<string>();
    useEffect(() => {
        getContext().then((c) => {
            const tenantId = c.user?.tenant?.id;
            // const link = `https://admin.teams.microsoft.com/policies/manage-apps/${AAD_ID}/permission`;
            const link = `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${AAD_ID}&scope=openid profile offline_access`;
            setLink(link);
        });
    }, []);

    useEffect(() => {
        const getFocus = () => {
            getAuthToken({ silent: true }).then(onLogin);
        };
        window.addEventListener("focus", getFocus);
        return () => {
            window.removeEventListener("focus", getFocus);
        };
    }, [onLogin]);

    return (
        <div className={styles.root}>
            <ShieldKeyholeRegular className={styles.img} />
            <div className={styles.description}>
                <Text>{t(TransKeys.loginDescription)}</Text>
            </div>
            <Button
                icon={<PersonAccountsFilled />}
                appearance="primary"
                as="a"
                onClick={() => getAuthToken({ silent: false }).then(onLogin)}
                disabled={!link}
                href={link}
                target="_blank"
            >
                {t(TransKeys.login)}
            </Button>
        </div>
    );
};
