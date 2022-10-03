import React from "react";
import { mergeClasses, Radio, RadioGroup, Text } from "@fluentui/react-components";
import { BuildingFilled, PersonHeartFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { UserType } from "../../model/sticker";
import { useHeaderStyles } from "./Header.styles";

export interface HeaderButtonProps {
    onRadioChange: (value: UserType) => void;
    type: UserType;
    className?: string;
}

const Header: React.FC<HeaderButtonProps> = ({ type, onRadioChange, className }: HeaderButtonProps): JSX.Element => {
    const styles = useHeaderStyles();
    const { t } = useTranslation();
    const header = t(TransKeys.title, { context: type });
    return (
        <header className={mergeClasses(styles.root, className)}>
            <Text as="h1" size={600} weight="bold">
                {header}
            </Text>
            <RadioGroup value={type} onChange={(_, data) => onRadioChange(data.value as UserType)} layout="horizontal">
                <Radio value="user" title={t(TransKeys.title, { context: "user" })} label={<PersonHeartFilled />} />
                <Radio value="company" title={t(TransKeys.title, { context: "company" })} label={<BuildingFilled />} />
            </RadioGroup>
        </header>
    );
};

export default Header;
