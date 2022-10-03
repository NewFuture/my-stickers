import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useImageListStyles = makeStyles({
    grid: {
        display: "grid",
        justifyContent: "space-around",
        ...shorthands.gap(".5rem"),
        ...shorthands.padding(".5rem"),
        "@media (max-width: 400px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
        },
        "@media (min-width: 400px) and (max-width: 600px)": {
            gridTemplateColumns: "repeat(3, 1fr)",
        },
        "@media (min-width: 600px) and (max-width: 800px)": {
            gridTemplateColumns: "repeat(4, 1fr)",
        },
        "@media (min-width: 800px) and (max-width: 1800px)": {
            gridTemplateColumns: "repeat(5, 1fr)",
        },
        "@media (min-width: 1800px)": {
            gridTemplateColumns: "repeat(auto-fit, 300px)",
        },
    },
    item: {
        minWidth: "150px",
        minHeight: "150px",
        maxHeight: "300px",
        maxWidth: "300px",
        aspectRatio: "1/1",
        boxShadow: tokens.shadow64Brand,
        ...shorthands.overflow("hidden"),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
});
