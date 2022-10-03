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
        "@media (min-width: 400px) and (max-width: 599px)": {
            gridTemplateColumns: "repeat(3, 1fr)",
        },
        "@media (min-width: 600px) and (max-width: 799px)": {
            gridTemplateColumns: "repeat(4, 1fr)",
        },
        "@media (min-width: 800px) and (max-width: 1299px)": {
            gridTemplateColumns: "repeat(5, 1fr)",
        },
        "@media (min-width: 1300px) and (max-width: 1499px)": {
            gridTemplateColumns: "repeat(6, 1fr)",
        },
        "@media (min-width: 1500px) and (max-width: 2000px)": {
            gridTemplateColumns: "repeat(7, 1fr)",
        },
        "@media (min-width: 2001px)": {
            gridTemplateColumns: "repeat(auto-fit, calc(250px + 1%))",
        },
    },
    item: {
        minWidth: "120px",
        minHeight: "120px",
        maxHeight: "300px",
        maxWidth: "300px",
        aspectRatio: "1/1",
        boxShadow: tokens.shadow64Brand,
        ...shorthands.overflow("hidden"),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
});
