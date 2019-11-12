import React from "react";
import { Menu, Popup, Button } from "@stardust-ui/react";
import SearchBox from "./SearchBox";
import { useTranslation } from "react-i18next";
import { NS, Common } from "../../locales";

const BottomMenu: React.FC = () => {
  const { t } = useTranslation(NS.common)
  return (
    <Menu
      iconOnly
      items={[
        {
          key: 'a',
          size: "large",
          icon: "format",
          // outline: true,
          disabled: true
        },
        {
          key: 'r',
          size: "large",
          icon: "redbang",
          // outline: true,
          disabled: true
        },
        {
          key: 'paperclip',
          size: "large",
          icon: "paperclip",
          // outline: true,
          disabled: true
        },
        {
          key: 'emoji',
          size: "large",
          icon: "emoji",
          // outline: true,
          disabled: true
        },
        {
          key: 'giphy',
          size: "large",
          icon: "giphy",
          // outline: true,
          disabled: true
        },
        {
          key: 'sticker',
          size: "large",
          icon: "sticker",
          // outline: true,
          disabled: true
        },
        {

          content: <Popup
            position="above"
            // align='center'
            content={<SearchBox />}
            trigger={<Button title={t(Common.shortTitle)} iconOnly>♥</Button>}
          />,
          key: 'custom sticker',
          // size: "large",
          // content: "♥",
          // onClick: () => { }
          // disabled: true
        },
        {
          key: 'more',
          size: "large",
          icon: "more",
          // outline: true,
          disabled: true
        },
      ]}
    />
  )
}
export default BottomMenu;