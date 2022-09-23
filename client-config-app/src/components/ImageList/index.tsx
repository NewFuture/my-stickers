import ImageList from "./ImageList";
import React from "react";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";
import { Sticker } from "../../model/sticker";
import { Spinner } from "@fluentui/react-components";

export interface ListProps {
    loading: boolean;
    stickes: Sticker[];
    isTenant: boolean;
}

export const List: React.FC<ListProps> = ({ loading, stickes, isTenant }: ListProps): JSX.Element => {
    const { t } = useTranslation();
    return loading ? (
        <Spinner label={t(TransKeys.loading)} size="extra-large" />
    ) : (
        <ImageList items={stickes} isTenant={isTenant} />
    );
};

export default List;
