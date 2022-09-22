import { makeStyles } from "@fluentui/react-components";

export const useUploadButtonStyles = makeStyles({
    root: {
        position: "relative",
        textAlign: "center",
        width: "24vw",
        height: "24vw",
        overFlow: "hidden",
        boxShadow: "0 0 5px whitesmoke",
    },
    icon: {
        width: "100%",
        height: "100%",
    },
});
