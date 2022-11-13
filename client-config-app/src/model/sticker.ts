export enum StickerStatus {
    upload = "add",
    uploading = "uploading",
    success = "success",
    upload_fail = "upload_fail",

    delete = "delete",
    delete_fail = "delete_fail",

    editing = "edit",
    edit_fail = "edit_fail",
    // updating = "update",

    moving = "move",
}

export interface Sticker {
    src: string;
    id: string;
    name?: string;
    status?: StickerStatus;
    progress?: number;
    weight?: number;
}

export type UserType = "user" | "company";
