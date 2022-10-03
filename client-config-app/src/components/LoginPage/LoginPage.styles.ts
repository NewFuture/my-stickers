import { makeStyles, tokens } from "@fluentui/react-components";

export const useLoginPageStyles = makeStyles({
    root: {
        textAlign: "center",
        justifyContent: "center",
    },
    img: {
        width: "300px",
        height: "300px",
        color: tokens.colorBrandForeground1,
        marginBottom: "16px",
        marginTop: "16px",
    },
    description: {
        marginBottom: "16px",
    },
});
