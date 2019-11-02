import * as teams from "@microsoft/teams-js";

export function init() {
    return new Promise((resolve, reject) => {
        try {
            teams.initialize(resolve)
        } catch (error) {
            reject(error)
        }
    })
}

export function exit(result?: string) {
    teams.authentication.notifySuccess(result)
}

export function getUserId(): Promise<string> {
    return new Promise(resolve => teams.getContext((c) => resolve(c.userObjectId)));
}