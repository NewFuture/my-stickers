import { Button, makeStyles } from "@fluentui/react-components";
import React, { useCallback } from "react";
import { ConfigPage, NS } from "../locales";
import { exit } from "../services/teams";
import UploadButton from "./upload-button";
import LanguageButton from "./LanguageButton";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "../lib/store";
import { Status } from "../reducer/status";

const useStyles = makeStyles({
    root: {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "space-between",
    },
});
const HeaderBtns: React.FC = () => {
    const { t } = useTranslation(NS.configPage);
    const status = useSelector((state: StateType) => state.status);
    const onExit = useCallback(() => exit(), []);
    const styles = useStyles();
    return (
        <header className={styles.root}>
            <LanguageButton key="lang" className="" />
            <UploadButton key="upload" disabled={status === Status.pending} multiple>
                {t(ConfigPage.upload)}
            </UploadButton>
            <Button
                disabled={status === Status.syncing}
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
