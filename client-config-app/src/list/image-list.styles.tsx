import { makeStyles } from "@fluentui/react-components";

export const useImageListStyles = makeStyles({
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, calc(25%))",
    },
    item: {
        position: "relative",
        textAlign: "center",
        width: "24vw",
        height: "24vw",
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
        justifyContent: "end",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        opacity: "0.8",
        ":hover": {
            backgroundColor: "#DCDCDC",
        },
    },
    close: {
        position: "absolute",
        left: "1em",
        top: "0.5em",
        backgroundColor: "#F5F5F5",
        opacity: "0.8",
        ":hover": {
            backgroundColor: "#DCDCDC",
        },
    },
    input: {
        fontWeight: "bold",
        fontSize: "large",
        ":after": {
            // bord
        },
    },
    uploadingBar: {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: "0",
        right: "0",
        bottom: "0.2em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        opacity: "0.8",
    },
    icon: {
        width: "20px",
        height: "20px",
    },
});
