import { makeStyles, tokens } from "@fluentui/react-components";

export const useUploadButtonStyles = makeStyles({
    root: {
        position: "relative",
        textAlign: "center",
    },
    icon: {
        width: "100%",
        height: "100%",
    },
    errors: {
        position: "fixed",
        top: 0,
        paddingLeft: "1em",
        paddingRight: "1em",
        width: "100%",
        zIndex: 1000,
        boxSizing: "border-box",
    },
});
