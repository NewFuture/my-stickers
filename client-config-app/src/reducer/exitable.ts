export enum ExitableActionType {
    exit_enable = "exit_enable",
    exit_disable = "exit_disable",
}

export type ExitableAction = {
    type: ExitableActionType.exit_enable
} | {
    type: ExitableActionType.exit_disable
}

export function exitableReducer(enable = true, action: ExitableAction): boolean {
    switch (action.type) {
        case ExitableActionType.exit_enable:
            return true;
        case ExitableActionType.exit_disable:
            return false;
        default:
            return enable;
    }
}
