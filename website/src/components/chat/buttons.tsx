import React from "react";
import { Button, ChevronEndMediumIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { HeartIcon } from "../../icons/heart";

export const SaveStickersButton: React.FC = () => {
    const { t } = useTranslation();
    return <Button primary text icon={<HeartIcon />} content={t(TransKeys.protoMsgExtMenuSaveStickers)} />;
};

export const StickersSavedTitle: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <HeartIcon styles={{ color: "#cc4a31" }} size={"large"} />
            {t(TransKeys.shortTitle)} - {t(TransKeys.protoMsgExtStickerSavedTitle)}
        </>
    );
};

export const MoreButton: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Button
            icon={<ChevronEndMediumIcon />}
            iconPosition="after"
            primary
            text
            content={t(TransKeys.protoMsgExtMenuMoreAction)}
        />
    );
};
