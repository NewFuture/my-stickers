import { makeStyles, tokens } from "@fluentui/react-components";

export const useHeaderStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        color: tokens.colorBrandForeground1,
        "@media (min-width: 400px)": {
            justifyContent: "space-between",
            paddingLeft: "2%",
            paddingRight: "2%",
        },
    },
});
