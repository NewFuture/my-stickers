import React, { useState } from "react";
import { SplitButton } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";
import { NS, Common } from "../locales";
import { isNumber } from "util";

const LanguageList = [
    { key: "zh", content: "中文" },
    { key: "en", content: "English" },
];
const LanguageButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation(NS.common);
    return (
        <SplitButton
            styles={{
                position: "absolute",
                top: "1.5em",
                right: "1.5em",
            }}
            menu={LanguageList}
            button={{
                content: t(Common.langSetting),
                icon: "translation",
            }}
            open={isOpen}
            toggleButton={{ onClick: () => setIsOpen(open => !open) }}
            onMainButtonClick={() => setIsOpen(open => !open)}
            onMenuItemClick={(_, v) => {
                const index = v && v.index;
                if (isNumber(index)) {
                    const l = LanguageList[index];
                    if (l) {
                        i18n.changeLanguage(l.key);
                    }
                    setIsOpen(false);
                }
            }}
        />
    );
};

export default LanguageButton;
