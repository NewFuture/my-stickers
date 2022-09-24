import { makeStyles } from "@fluentui/react-components";

export const useHeaderStyles = makeStyles({
    root: {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "space-between",
    },
    h: {
        display: "inline-block",
        marginTop: 0,
        marginBottom: 0,
    }
});