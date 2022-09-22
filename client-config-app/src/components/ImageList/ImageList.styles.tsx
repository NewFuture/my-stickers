import { makeStyles } from "@fluentui/react-components";

export const useImageListStyles = makeStyles({
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, calc(25%))",
    },
});
