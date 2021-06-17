import * as teams from "@microsoft/teams-js";

export const auth = {
    id: '',
    token: '',
}

teams.initialize(() => {console.debug("teams initialized")})

export function init() {
    auth.token = new URLSearchParams(window.location.search).get('token')!;
    return getUserId().then(id => {
        auth.id = id;
        return auth
    });
    // return new Promise<typeof auth>((resolve, reject) => {
       
    //     try {
    //         getUserId().then(id => {
    //             auth.id = id;
    //             resolve(auth);
    //         }, reject)
    //     } catch (error) {
    //         console.error('initialize error', error)
    //         reject(error)
    //     }
    // })
}

export function exit(result?: string) {
    teams.authentication.notifySuccess(result)
}

function getUserId(): Promise<string> {
    return new Promise(resolve => teams.getContext((c) => {
        console.debug(c)
        resolve(c.userObjectId!)
    }));
}

