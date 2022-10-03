import { makeStyles, tokens } from "@fluentui/react-components";

export const useImageItemStyles = makeStyles({
    root: {
        position: "relative",
    },
    img: {
        width: "100%",
        height: "100%",
    },
    status: {
        position: "absolute",
        left: "1em",
        top: "0.5em",
        opacity: "0.9",
    },
    del: {
        position: "absolute",
        right: "1em",
        top: "0.5em",
        opacity: "0.9",
        ":hover": {
            opacity: 1,
            boxShadow: tokens.shadow4,
            backgroundColor: tokens.colorBackgroundOverlay,
        },
    },
    bottom: {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "1em",
        paddingRight: "1em",
        paddingBottom: "0.5em",
        backgroundColor: tokens.colorBackgroundOverlay,
    },
    inputWrapper: {
        maxWidth: "100%",
        width: "100%",
    },
    input: {
        textAlign: "center",
        textShadow: tokens.shadow8,
        color: tokens.colorBrandBackgroundInverted,
        fontWeight: "bold",
    },
});
