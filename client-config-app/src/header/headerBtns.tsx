import { Button, Flex } from "@stardust-ui/react";
import React, { useCallback } from "react";
import { ConfigPage, NS } from "../locales";
import { exit } from "../services/teams";
import UploadButton from "./upload-button";
import LanguageButton from "./LanguageButton";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "../lib/store";
import { Status } from "../reducer/status";

const HeaderBtns: React.FC = () => {
    const { t } = useTranslation(NS.configPage);
    const status = useSelector((state: StateType) => state.status);
    const onExit = useCallback(() => exit(), []);
    return (
        <Flex as="header" vAlign="center" hAlign="center" space="between" padding="padding.medium">
            <LanguageButton key="lang" styles={{ display: "block" }} />
            <UploadButton key="upload" disabled={status === Status.pending} multiple>
                {t(ConfigPage.upload)}
            </UploadButton>
            <Button
                disabled={status === Status.syncing}
                icon="accept"
                key="exit"
                primary
                iconOnly
                circular
                onClick={onExit}
            />
        </Flex>
    );
};

export default HeaderBtns;
