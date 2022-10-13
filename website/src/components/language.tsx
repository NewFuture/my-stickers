import React from "react";
import { SplitButton, ICSSInJSStyle, TranslationIcon } from "@fluentui/react-northstar";
import { useTranslation } from "react-i18next";

const LanguageList = [
    { key: "zh-cn", content: "中文" },
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
            onMainButtonClick={() => i18n.changeLanguage(i18n.language.toLowerCase() === "zh-cn" ? "en" : "zh-cn")}
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
