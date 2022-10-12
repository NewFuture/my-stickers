import React from "react";
import { SplitButton, ICSSInJSStyle, TranslationIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";
import { NS } from "../locales";

const LanguageList = [
    { key: "zh", content: "中文" },
    { key: "en", content: "English" },
];
const LanguageButton: React.FC<{ styles?: ICSSInJSStyle }> = (props) => {
    const { i18n } = useTranslation(NS.common);
    return (
        <SplitButton
            styles={props.styles}
            menu={LanguageList}
            button={{
                iconOnly: true,
                icon: <TranslationIcon />,
            }}
            onMainButtonClick={() => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")}
            onMenuItemClick={(_, v) => {
                const index = v && v.index;
                if (typeof index === "number") {
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
