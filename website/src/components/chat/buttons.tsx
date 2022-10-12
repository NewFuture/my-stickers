import React from "react";
import { Button, ChevronEndMediumIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { NS, HomePage, Common } from "../../locales";
import { HeartIcon } from "../../icons/heart";

export const SaveStickersButton: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return <Button primary text icon={<HeartIcon />} content={t(HomePage.protoMsgExtMenuSaveStickers)} />;
};

export const StickersSavedTitle: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return (
        <>
            <HeartIcon styles={{ color: '#cc4a31' }} size={"large"} />
            {t(Common.shortTitle)} - {t(HomePage.protoMsgExtStickerSavedTitle)}
        </>
    );
};

export const MoreButton: React.FC = () => {
    const { t } = useTranslation(NS.homePage);
    return (
        <Button
            icon={<ChevronEndMediumIcon />}
            iconPosition="after"
            primary
            text
            content={t(HomePage.protoMsgExtMenuMoreAction)}
        />
    );
};
