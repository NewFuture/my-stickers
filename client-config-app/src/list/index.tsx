import ImageList from "./image-list";
import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "../lib/store";
import { Status } from "../reducer/status";
import { Loader } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";
import { ConfigPage } from "../locales";

const List: React.FC = () => {
    const status = useSelector((state: StateType) => state.status);
    const stickes = useSelector((state: StateType) => state.stickers);
    const { t } = useTranslation();
    return status === Status.pending ? (
        <Loader styles={{ paddingTop: "5em" }} label={t(ConfigPage.loading)} size="larger" />
    ) : (
        <ImageList items={stickes} />
    );
};

export default List;
