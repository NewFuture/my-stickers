import { Button, makeStyles } from "@fluentui/react-components";
import React, { useCallback } from "react";
import { ConfigPage, NS } from "../locales";
import { exit } from "../services/teams";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "./LanguageButton";

const useStyles = makeStyles({
    root: {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "space-between",
    },
});

export interface HeaderButtonProps {
    disabled: boolean
}

const HeaderBtns: React.FC<HeaderButtonProps> = ({disabled}:HeaderButtonProps):JSX.Element => {
    const onExit = useCallback(() => exit(), []);
    const styles = useStyles();
    return (
        <header className={styles.root}>
            <LanguageButton key="lang"/>
            <Button
                disabled={disabled}
                icon="accept"
                key="exit"
                appearance="primary"
                shape="circular"
                onClick={onExit}
            />
        </header>
    );
};

export default HeaderBtns;
