import { makeStyles, Radio, RadioGroup } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
    root: {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "space-between",
    },
});

export interface HeaderButtonProps {
    onRadioChange: (value: string) => void;
    radio: string;
}

const HeaderBtns: React.FC<HeaderButtonProps> = ({ radio, onRadioChange }: HeaderButtonProps): JSX.Element => {
    const styles = useStyles();
    return (
        <header className={styles.root}>
            <RadioGroup value={radio} onChange={(_, data) => onRadioChange(data.value)} layout="horizontal">
                <Radio value="Tenant" label="Tenant" />
                <Radio value="Personal" label="Personal" />
            </RadioGroup>
        </header>
    );
};

export default HeaderBtns;
