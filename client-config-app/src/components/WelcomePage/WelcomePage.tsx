import React, { useEffect, useState } from "react";
import { Button, Text, Image } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useWelcomePageStyles } from "./WelcomePage.styles";
import { TransKeys } from "../../locales";
import { getContext } from "../../services/teams";
import LoginPic from "../../assets/LoginPagePic.png";

interface WelcomePageProps {
    onLogin: (token: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = (props) => {
    const { t } = useTranslation();
    const styles = useWelcomePageStyles();
    const loginDescription = t(TransKeys.loginDescription);
    const action = t(TransKeys.login);
    const [link, setLink] = useState<string>();
    useEffect(() => {
        getContext().then((c) => {
            const tenantId = c.user?.tenant?.id;
            const link = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_AAD_ID}&response_type=code&redirect_uri=${window.location.origin}&scope=openid`;
            setLink(link);
        });
    }, []);
    return (
        <div className={styles.root}>
            <Image className={styles.img} src={LoginPic} />
            <div className={styles.description}>
                <Text>{loginDescription}</Text>
            </div>
            <Button appearance="primary" as="a" disabled={!link} href={link} target="_blank">
                {action}
            </Button>
        </div>
    );
};
