import { DeleteFilled } from "@fluentui/react-icons";
import { Alert as FUIAlert } from "@fluentui/react-components/unstable";
import React, { FC, useState } from "react";

export const Alert: FC<React.PropsWithChildren> = ({ children }) => {
    const [hidden, setHidden] = useState<boolean>();
    return hidden ? null : (
        <FUIAlert
            intent="error"
            action={{
                icon: <DeleteFilled aria-label="dismiss message" />,
                onClick: () => setHidden(true),
            }}
        >
            Save failed
        </FUIAlert>
    );
};
