import ImageList from "./image-list";
import React from "react";
import { Loader } from "@stardust-ui/react";
import { useTranslation } from "react-i18next";
import { ConfigPage } from "../locales";
import { Sticker } from "../model/sticker";

export interface ListProps {
    loading: boolean;
    stickes: Sticker[];
    isTenant: boolean;
}

export const List: React.FC<ListProps> = ({ loading, stickes, isTenant }: ListProps): JSX.Element => {
    const { t } = useTranslation();
    return loading ? (
        <Loader styles={{ paddingTop: "5em" }} label={t(ConfigPage.loading)} size="larger" />
    ) : (
        <ImageList items={stickes} isTenant={isTenant} />
    );
};

export default List;
