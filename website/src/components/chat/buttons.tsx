import React from "react";
import { Button, Icon } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";

import { TransKeys } from "../../locales";

export const SaveStickersButton: React.FC = () => {
    const { t } = useTranslation();
    return <Button primary text icon="heart" content={t(TransKeys.protoMsgExtMenuSaveStickers)} />;
};

export const StickersSavedTitle: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Icon name="heart" color="orange" size="large" />
            {t(TransKeys.shortTitle)} - {t(TransKeys.protoMsgExtStickerSavedTitle)}
        </>
    );
};

export const MoreButton: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Button
            icon="stardust-menu-arrow-end"
            iconPosition="after"
            primary
            text
            content={t(TransKeys.protoMsgExtMenuMoreAction)}
        />
    );
};
