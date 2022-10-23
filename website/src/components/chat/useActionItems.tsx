import {
    BookmarkIcon,
    MarkAsUnreadIcon,
    MenuItemProps,
    MenuShorthandKinds,
    MoreIcon,
    ShorthandCollection,
    TranslationIcon,
} from "@fluentui/react-northstar";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HeartIcon } from "../../icons/heart";
import { TransKeys } from "../../locales";
import { MoreButton, SaveStickersButton } from "./buttons";

export function useActionItems(clickEvent: () => void): ShorthandCollection<MenuItemProps, MenuShorthandKinds> {
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                key: "heart",
                icon: <HeartIcon styles={{ color: "#cc4a31" }} />,
                title: "❤",
            },
            {
                key: "point1",
                icon: "👉",
                title: "👉",
            },
            {
                key: "point2",
                icon: "👉",
                title: "👉",
            },
            {
                key: "point3",
                icon: "👉",
                title: "👉",
            },
            {
                key: "more",
                icon: <MoreIcon />,
                indicator: false,
                title: "More actions",
                menu: {
                    items: [
                        {
                            key: "bookmark",
                            icon: <BookmarkIcon />,
                            disabled: true,
                            content: t(TransKeys.protoMsgExtMenuSaveMsg),
                        },
                        {
                            key: "unread",
                            icon: <MarkAsUnreadIcon />,
                            disabled: true,
                            content: t(TransKeys.protoMsgExtMenuUnread),
                        },
                        {
                            key: "translate",
                            icon: <TranslationIcon />,
                            disabled: true,
                            content: t(TransKeys.protoMsgExtMenuTranslate),
                        },
                        {
                            "data-is-focusable": true,
                            defaultMenuOpen: false,
                            indicator: false,
                            key: "more",
                            content: <MoreButton />,
                            menu: {
                                "data-is-focusable": true,
                                items: [
                                    {
                                        key: "save",
                                        content: <SaveStickersButton />,
                                        menuOpen: false,
                                        onClick: () => clickEvent(),
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ],
        [t, clickEvent],
    );
}
