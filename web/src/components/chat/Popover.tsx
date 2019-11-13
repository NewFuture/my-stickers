import { Menu, Dialog } from "@stardust-ui/react";
import React from "react";
import { SaveStickersButton, MoreButton, StickersSavedTitle } from "./buttons";
import { TFunction } from "i18next";
import { HomePage } from "../../locales";

export interface PopoverProps {
    className?: string;
    disabled: boolean;
    t: TFunction,
    onForceShowActionMenuChange: (val: boolean) => void;
    onShowActionMenuChange: (val: boolean) => void;
    chatMessageElement?: HTMLElement;
    dialogContent: JSX.Element;
}

interface PopoverState {
    focused: boolean;
    open: boolean;
}

// const popoverBehavior: Accessibility = (props: any) => {
//     const behavior = menuAsToolbarBehavior(props)

//     behavior.focusZone!.props!.defaultTabbableElement = (root: HTMLElement): HTMLElement => {
//         return root.querySelector!('[aria-label="like"]') as HTMLElement
//     }

//     return behavior
// }

// const daiglog =
class Popover extends React.Component<PopoverProps, PopoverState> {
    state = {
        focused: true,
        open: false,
    };

    handleFocus = () => this.setState({ focused: true });

    close = () => this.setState({ open: false });
    open = () => this.setState({ open: true });
    handleBlur = (e: any) => {
        this.setState({ focused: e.currentTarget.contains(e.relatedTarget) });
    };

    handleActionableItemClick = (e: any) => {
        const { onShowActionMenuChange, chatMessageElement } = this.props;
        onShowActionMenuChange!(false);
        // Currently when the action menu is closed because of some actionable item is clicked, we focus the ChatMessage
        // this was not in the spec, so it may be changed if the requirement is different
        e.type === "keydown" && chatMessageElement && chatMessageElement.focus();
    };

    render() {
        const { t, dialogContent, disabled, onShowActionMenuChange, onForceShowActionMenuChange, ...rest } = this.props;
        const { open } = this.state;
        delete rest.chatMessageElement;
        return (
            <>
                <Menu
                    {...rest}
                    // accessibility={popoverBehavior}
                    iconOnly
                    className={this.props.className || "" + this.state.focused ? "focused" : ""}
                    items={[
                        {
                            key: "smile",
                            disabled: true,
                            // icon: 'smile',
                            className: "smile-emoji",
                            "aria-label": "smile one",
                            onClick: this.handleActionableItemClick,
                            content: "❤",
                        },
                        {
                            key: "smile3",
                            disabled: true,
                            // icon: 'smile',
                            className: "smile",
                            "aria-label": "smile three",
                            content: "👉",
                            onClick: this.handleActionableItemClick,
                        },
                        {
                            key: "a",
                            disabled: true,
                            // icon: '',
                            "aria-label": "like",
                            content: "👉",
                            onClick: this.handleActionableItemClick,
                        },
                        {
                            key: "r",
                            disabled: true,
                            // icon: '',
                            "aria-label": "like",
                            content: "👉",
                            onClick: this.handleActionableItemClick,
                        },
                        {
                            key: "c",
                            icon: "more",
                            indicator: false,
                            onMenuOpenChange: (e, props) => {
                                onShowActionMenuChange(true);
                                onForceShowActionMenuChange(props! && props!.menuOpen!);
                            },
                            "aria-label": "more options",

                            // defaultMenuOpen: true,
                            menu: {
                                // pills: true,
                                "data-is-focusable": true,
                                items: [
                                    { key: "bookmark", icon: "bookmark", disabled: true, content: t(HomePage.protoMsgExtMenuSaveMsg) },
                                    {
                                        key: "unread",
                                        icon: "mark-as-unread",
                                        disabled: true,
                                        content: t(HomePage.protoMsgExtMenuUnread),
                                    },
                                    { key: "translate", icon: "translation", disabled: true, content: t(HomePage.protoMsgExtMenuTranslate) },
                                    {
                                        "data-is-focusable": true,
                                        defaultMenuOpen: true,
                                        key: "more",
                                        content: <MoreButton />,
                                        menu: {
                                            "data-is-focusable": true,
                                            items: [
                                                {
                                                    key: "save",
                                                    content: <SaveStickersButton />,
                                                    menuOpen: true,
                                                    onClick: () => this.open(),
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ]}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    data-is-focusable
                />
                <Dialog
                    open={open}
                    onOpen={this.open}
                    onCancel={this.close}
                    onConfirm={this.close}
                    styles={{ width: "30em", textAlign: "center" }}
                    // confirmButton="Confirm"
                    content={{
                        styles: { width: "100%" },
                        content: dialogContent,
                    }}
                    header={<StickersSavedTitle />}
                    headerAction={{
                        icon: "close",
                        title: "Close",
                        onClick: this.close,
                    }}
                // trigger={<Button content="Open a dialog" />}
                />
            </>
        );
    }
}

export default Popover;
