import { Radio, RadioGroup } from "@fluentui/react-components";
import { BuildingFilled, StarFilled } from "@fluentui/react-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { UserType } from "../../model/sticker";
import { useHeaderStyles } from "./Header.styles";

export interface HeaderButtonProps {
    onRadioChange: (value: UserType) => void;
    type: UserType;
}

const Header: React.FC<HeaderButtonProps> = ({ type, onRadioChange }: HeaderButtonProps): JSX.Element => {
    const styles = useHeaderStyles();
    const { t } = useTranslation();
    const header = t(TransKeys.title, { context: type });
    return (
        <header className={styles.root}>
            <h1 className={styles.h}>{header}</h1>
            <RadioGroup value={type} onChange={(_, data) => onRadioChange(data.value as UserType)} layout="horizontal">
                <Radio value="user" title={t(TransKeys.title, { context: "user" })} label={<StarFilled />} />
                <Radio value="company" title={t(TransKeys.title, { context: "company" })} label={<BuildingFilled />} />
            </RadioGroup>
        </header>
    );
};

export default Header;
