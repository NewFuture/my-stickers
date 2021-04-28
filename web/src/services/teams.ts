import * as teams from "@microsoft/teams-js";

export const auth = {
    id: '',
    token: '',
}

export function init() {
    return new Promise((resolve, reject) => {
        auth.token = new URLSearchParams(window.location.search).get('token')!;
        try {
            teams.initialize(async () => {
                console.debug("teams initialized")
                auth.id = await getUserId();
                resolve(auth);
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
    return new Promise(resolve => teams.getContext((c) => resolve(c.userObjectId!)));
}

