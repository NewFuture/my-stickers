import { Menu, Dialog } from "@stardust-ui/react";
import React from "react";
// import cx from 'classnames'

export interface PopoverProps {
    className?: string;
    disabled: boolean;
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
        focused: false,
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
        const { dialogContent, disabled, onShowActionMenuChange, onForceShowActionMenuChange, ...rest } = this.props;
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
                        // {
                        //     key: "smile2",
                        //     disabled: true,
                        //     // icon: 'smile',
                        //     className: "emoji",
                        //     "aria-label": "smile two",
                        //     content: "😊",
                        //     onClick: this.handleActionableItemClick,
                        // },
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
                                    { key: "bookmark", icon: "bookmark", disabled: true, content: "Save this message" },
                                    {
                                        key: "unread",
                                        icon: "mark-as-unread",
                                        disabled: true,
                                        content: "Mark as unread",
                                    },
                                    { key: "translate", icon: "translation", disabled: true, content: "Translate" },
                                    {
                                        "data-is-focusable": true,
                                        defaultMenuOpen: true,
                                        key: "more",
                                        content: "More actions >",
                                        menu: {
                                            "data-is-focusable": true,
                                            items: [
                                                {
                                                    key: "save",
                                                    content: "♥ Save Stickers",
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
                    styles={{ width: "30%", textAlign: "center" }}
                    // confirmButton="Confirm"
                    content={{
                        styles: { width: "100%" },
                        content: dialogContent,
                    }}
                    header="♥ Saved!"
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
