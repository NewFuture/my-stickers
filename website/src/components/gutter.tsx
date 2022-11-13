import { Avatar, CheckmarkCircleIcon } from "@fluentui/react-northstar";
import avatar from "../img/avatar.png";

const gutter = (
    <Avatar
        name="New Future"
        image={{ src: avatar, loading: "lazy" }}
        status={{ color: "green", icon: <CheckmarkCircleIcon /> }}
    />
);

export default gutter;
