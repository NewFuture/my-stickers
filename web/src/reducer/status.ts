
/**
 * 全局状态
 */
export enum Status {

    /**
     * 正在初始化
     */
    pending = "pending",

    /**
     * 正在同步数据,
     * 此时不能退出
     */
    syncing = "syncing",

    /**
     * 数据完成可以正常退出
     */
    ready = "ready",
}

export enum StatusActionType {
    Status_Pending="Status_Fetching",
    Status_Ready = "Status_Ready",
}

export type StatusAction = {
    type:StatusActionType.Status_Pending,
}|{
    type:StatusActionType.Status_Ready,
}



function status(state = Status.pending, action: StatusAction): Status {
    switch (action.type) {
        case StatusActionType.Status_Pending:
            return Status.pending;
        case StatusActionType.Status_Ready:
            return Status.ready;
        // return state.map(todo =>
        //     (stickers.id === action.id)
        //         ? { ...todo, completed: !todo.completed }
        //         : todo
        // )
        default:
            return state
    }
}

export default status