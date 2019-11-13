import React from "react";
import { SplitButton } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";
import { NS, Common } from "../locales";
import { isNumber } from "util";

const LanguageList = [
    { key: "zh", content: "中文" },
    { key: "en", content: "English" },
];
const LanguageButton = () => {
    const { t, i18n } = useTranslation(NS.common);
    return (
        <SplitButton
            styles={{
                position: "absolute",
                top: "2em",
                right: "1.5em",
            }}
            menu={LanguageList}
            button={{
                size: "smaller",
                content: t(Common.langSetting),
                icon: "translation",
            }}
            onMainButtonClick={() => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")}
            onMenuItemClick={(_, v) => {
                const index = v && v.index;
                if (isNumber(index)) {
                    const l = LanguageList[index];
                    if (l) {
                        i18n.changeLanguage(l.key);
                    }
                }
            }}
        />
    );
};

export default LanguageButton;
