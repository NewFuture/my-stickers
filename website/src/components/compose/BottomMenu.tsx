import React from "react";
import {
    Menu,
    Popup,
    Button,
    UIComponentProps,
    FormatIcon,
    RedbangIcon,
    PaperclipIcon,
    EmojiIcon,
    GiphyIcon,
    StickerIcon,
    MoreIcon,
} from "@fluentui/react-northstar";
import { HeartIcon } from "../../icons/heart";
import SearchBox from "./SearchBox";
import { useTranslation } from "react-i18next";
import { TransKeys } from "../../locales";

const BottomMenu: React.FC<UIComponentProps> = (props) => {
    const { t } = useTranslation();
    return (
        <Menu
            {...props}
            iconOnly
            items={[
                {
                    key: "a",
                    size: "large",
                    icon: <FormatIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    key: "r",
                    size: "large",
                    icon: <RedbangIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    key: "paperclip",
                    size: "large",
                    icon: <PaperclipIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    key: "emoji",
                    size: "large",
                    icon: <EmojiIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    key: "giphy",
                    size: "large",
                    icon: <GiphyIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    key: "sticker",
                    size: "large",
                    icon: <StickerIcon />,
                    // outline: true,
                    disabled: true,
                },
                {
                    content: (
                        <Popup
                            position="above"
                            // align='center'
                            content={<SearchBox />}
                            trigger={
                                <Button title={t(TransKeys.shortTitle)} icon={<HeartIcon outline={true} />} iconOnly />
                            }
                        />
                    ),
                    key: "custom sticker",
                    // size: "large",
                    // content: "♥",
                    // onClick: () => { }
                    // disabled: true
                },
                {
                    key: "more",
                    size: "large",
                    icon: <MoreIcon />,
                    // outline: true,
                    disabled: true,
                },
            ]}
        />
    );
};
export default BottomMenu;
