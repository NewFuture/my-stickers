import { Avatar, AvatarProps, CheckmarkCircleIcon } from "@fluentui/react-northstar";
import React from "react";

const avatar: AvatarProps = {
    image: "https://avatars1.githubusercontent.com/u/6290356?s=64",
    status: { color: "green", icon: <CheckmarkCircleIcon /> },
    name: "New Future",
};

const gutter = <Avatar {...avatar} />;

export default gutter;
