import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useUploadButtonStyles = makeStyles({
    root: {
        position: "relative",
        textAlign: "center",
        cursor: "pointer",
    },
    icon: {
        cursor: "pointer",
        width: "100%",
        height: "100%",
        color: tokens.colorNeutralForeground2,
        ...shorthands.transition("scale", "0.3s"),
        ":hover": {
            scale: "1.1",
            color: tokens.colorBrandForeground1,
        },
    },
});
