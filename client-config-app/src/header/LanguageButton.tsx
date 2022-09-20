import React, { useMemo } from "react";
import {
    Menu,
    MenuButtonProps,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    SplitButton,
} from "@fluentui/react-components";
import { TranslateRegular } from "@fluentui/react-icons";

import { useTranslation } from "react-i18next";
import { NS, Common } from "../locales";

const LanguageList = [
    { key: "zh", content: "中文" },
    { key: "en", content: "English" },
];

export const LanguageButton = (): JSX.Element => {
    const { t } = useTranslation(NS.common);
    const items = useMemo(() => LanguageList.map((item) => <MenuItem key={item.key}>{item.content}</MenuItem>), []);
    return (
        <Menu positioning="below-end">
            <MenuTrigger>
                {(triggerProps: MenuButtonProps) => (
                    <SplitButton menuButton={triggerProps} icon={<TranslateRegular />}>
                        {t(Common.langSetting)}
                    </SplitButton>
                )}
            </MenuTrigger>
            <MenuPopover>
                <MenuList>{items}</MenuList>
            </MenuPopover>
        </Menu>
    );
};
