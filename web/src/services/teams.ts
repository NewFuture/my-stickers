import * as teams from "@microsoft/teams-js";
const token = new URLSearchParams(window.location.search).get('token');

export function init() {
    return new Promise((resolve, reject) => {
        try {
            teams.initialize(async () => {
                resolve();
                auth.id = await getUserId();
            })
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

export const auth = {
    id: '',
    token,
}