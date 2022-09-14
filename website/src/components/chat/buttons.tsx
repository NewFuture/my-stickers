import React from "react";
import { Button, Icon } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { NS, HomePage, Common } from "../../locales";

export const SaveStickersButton: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return <Button primary text icon="heart" content={t(HomePage.protoMsgExtMenuSaveStickers)} />;
};

export const StickersSavedTitle: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return (
        <>
            <Icon name="heart" color="orange" size="large" />
            {t(Common.shortTitle)} - {t(HomePage.protoMsgExtStickerSavedTitle)}
        </>
    );
};

export const MoreButton: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return (
        <Button
            icon="stardust-menu-arrow-end"
            iconPosition="after"
            primary
            text
            content={t(HomePage.protoMsgExtMenuMoreAction)}
        />
    );
};
