import { makeStyles, tokens } from "@fluentui/react-components";

export const useUploadItemStyles = makeStyles({
    root: {
        position: "relative",
        overFlow: "hidden",
        boxShadow: tokens.shadow64Brand,
    },
    img: {
        width: "100%",
        height: "100%",
    },
    name: {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        color: tokens.colorBrandForeground2,
        backgroundColor: tokens.colorBrandBackground2,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        backgroundColor: tokens.colorBackgroundOverlay,
    },
    error: {
        color: tokens.colorPaletteRedForeground1,
        textShadow: tokens.shadow4Brand,
    },
    progressText: {
        color: tokens.colorBrandBackground,
        textShadow: tokens.shadow4Brand,
    },
    progress: {
        width: "90%",
        "::-webkit-progress-value": {
            backgroundColor: tokens.colorBrandBackground,
        },
    },
});
