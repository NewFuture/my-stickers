import { makeStyles, tokens } from "@fluentui/react-components";

export const useLoginPageStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        rowGap: "2em",
    },
    img: {
        minHeight: "150px",
        minWidth: "150px",
        maxHeight: "800px",
        maxWidth: "800px",
        width: "min(40vh,40vw)",
        height: "min(40vh,40vw)",
        marginTop: "-2em",
        color: tokens.colorBrandForeground1,
    },
    desc: {
        paddingLeft: "5%",
        paddingRight: "5%",
        whiteSpace: "pre-wrap",
    },
});
