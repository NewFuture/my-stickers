import React from "react";
import {
    Menu,
    MenuItemRadio,
    MenuList,
    MenuPopover,
    MenuTrigger,
    mergeClasses,
    SplitButton,
    Text,
} from "@fluentui/react-components";
import { BuildingFilled, PersonHeartFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { UserType } from "../../model/sticker";
import { useHeaderStyles } from "./Header.styles";

export interface HeaderButtonProps {
    onTypeChange: (value: UserType) => void;
    type: UserType;
    className?: string;
}

const Header: React.FC<HeaderButtonProps> = ({ type, onTypeChange, className }: HeaderButtonProps): JSX.Element => {
    const styles = useHeaderStyles();
    const { t } = useTranslation();
    return (
        <header className={mergeClasses(styles.root, className)}>
            <Text as="h1" size={600} weight="bold">
                {t(TransKeys.title, { context: type })}
            </Text>
            <Menu>
                <MenuTrigger>
                    <SplitButton
                        title={t(TransKeys.radioLabel)}
                        icon={type === "company" ? <BuildingFilled /> : <PersonHeartFilled />}
                    >
                        {t(TransKeys.radio, { context: type })}
                    </SplitButton>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList
                        checkedValues={{ type: [type] }}
                        onCheckedValueChange={(_, { checkedItems }) => onTypeChange(checkedItems[0] as UserType)}
                    >
                        <MenuItemRadio icon={<PersonHeartFilled />} name="type" value="user">
                            {t(TransKeys.radio, { context: "user" })}
                        </MenuItemRadio>
                        <MenuItemRadio icon={<BuildingFilled />} name="type" value="company">
                            {t(TransKeys.radio, { context: "company" })}
                        </MenuItemRadio>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </header>
    );
};

export default Header;
