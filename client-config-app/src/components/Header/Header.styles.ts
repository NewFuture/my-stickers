import { makeStyles, tokens } from "@fluentui/react-components";

export const useHeaderStyles = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        color: tokens.colorBrandForeground1,
        "@media(max-width: 399.9px)": {
            justifyContent: "center",
        },
        "@media(min-width: 400px)": {
            justifyContent: "space-between",
            paddingLeft: "2%",
            paddingRight: "2%",
        },
    },
});
