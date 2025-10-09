import React from "react";
import { SplitButton, ICSSInJSStyle, TranslationIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";

const LanguageList = [
    { key: "zh-cn", content: "简体中文" },
    { key: "zh-tw", content: "繁體中文" },
    { key: "en", content: "English" },
];
const LanguageButton: React.FC<{ styles?: ICSSInJSStyle }> = (props) => {
    const { i18n } = useTranslation();
    return (
        <SplitButton
            styles={props.styles}
            menu={LanguageList}
            button={{
                iconOnly: true,
                icon: <TranslationIcon />,
            }}
            onMainButtonClick={() => {
                const currentLang = i18n.language.toLowerCase();
                const currentIndex = LanguageList.findIndex((l) => l.key === currentLang);
                const nextIndex = (currentIndex + 1) % LanguageList.length;
                i18n.changeLanguage(LanguageList[nextIndex].key);
            }}
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
