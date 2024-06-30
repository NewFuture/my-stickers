import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useUploadButtonStyles = makeStyles({
    root: {
        position: "relative",
        textAlign: "center",
        cursor: "pointer",
        order: -999999,
    },
    icon: {
        width: "100%",
        height: "100%",
    },
    iconDisabled: {
        cursor: "not-allowed",
    },
    iconEnabled: {
        cursor: "pointer",
        color: tokens.colorNeutralForeground2,
        ...shorthands.transition("scale", "0.3s"),
        ":hover": {
            scale: "1.1",
            color: tokens.colorBrandForeground1,
        },
    },
});
