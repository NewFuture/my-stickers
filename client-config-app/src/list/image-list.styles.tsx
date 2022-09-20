import { makeStyles } from "@fluentui/react-components";

export const useImageListStyles = makeStyles({
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, calc(33%))",
    },
    item: {
        position: "relative",
        textAlign: "center",
        width: "32vw",
        height: "32vw",
        overFlow: "hidden",
        boxShadow: "0 0 5px whitesmoke",
    },
    img: {
        width: "100%",
        height: "100%",
    },
    bar: {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: "0",
        right: "0",
        bottom: "0.2em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    close: {
        position: "absolute",
        right: "0.5em",
        top: "0.5em",
    },
    edit: {
        position: "absolute",
        left: "1em",
        top: "0.5em",
    },
});
