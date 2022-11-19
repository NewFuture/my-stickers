import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        height: "1px",
        width: "100%",
        position: "absolute",
        backgroundImage: `repeating-linear-gradient(to right,transparent,${tokens.colorBackgroundOverlay}, ${tokens.colorNeutralStroke2},#d75a4a, ${tokens.colorNeutralStroke2},${tokens.colorBackgroundOverlay})`,
        backgroundSize: "200% auto",
        backgroundPositionY: "100%",
        animationName: {
            from: {
                backgroundPositionX: 0,
            },
            to: {
                backgroundPositionX: "-200%",
            },
        },
        animationDuration: "3s",
        animationIterationCount: "infinite",
        // animation: "gradient 2s infinite",
        animationFillMode: "forwards",
        animationTimingFunction: "ease-in-out",
    },
});

export function LinearSpinner({ hidden }: { hidden?: boolean }) {
    return <div hidden={hidden} aria-hidden className={useStyles().root} />;
}
