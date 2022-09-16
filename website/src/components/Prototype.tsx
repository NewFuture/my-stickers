import * as React from "react";
import { Box, Header, Segment, Provider, Divider } from "@stardust-ui/react";

import "./Prototype.scss";

interface PrototypeSectionProps {
    title?: React.ReactNode;
    styles?: React.CSSProperties;
}

interface ComponentPrototypeProps extends PrototypeSectionProps {
    description?: React.ReactNode;
}

export const PrototypeSection: React.FunctionComponent<ComponentPrototypeProps> = (props) => {
    const { title, children, styles, ...rest } = props;
    return (
        <Box className="PrototypeSection" {...rest}>
            <Divider important color="green">
                {title && (
                    <Header color="green" align="center" as="h2">
                        {title}
                    </Header>
                )}
            </Divider>
            {children}
        </Box>
    );
};

export const PrototypeComponent: React.FunctionComponent<ComponentPrototypeProps> = (props) => {
    const { description, title: header, children, styles, ...rest } = props;
    return (
        <Provider>
            <Box className="PrototypeComponent" {...rest}>
                <Header as="h3" className="PrototypeComponent-header">
                    {header}
                </Header>
                <Segment className="PrototypeComponent-content">
                    <div className="PrototypeComponent-contentBox">{children}</div>
                </Segment>
            </Box>
        </Provider>
    );
};
