import * as microsoftTeams from "@microsoft/teams-js";

export const auth = {
    id: '',
    token: '',
}

microsoftTeams.initialize(() => { console.debug("teams initialized") });

export function init() {
    auth.id = new URLSearchParams(window.location.search).get('id')!;
    auth.token = window.location.hash;
    return Promise.resolve(auth);

    // return app.initialize().then(() =>
    //     app.getContext()
    // ).then((context) => {
    //     console.debug(context);
    //     auth.id = context.user?.id!;
    //     return auth
    // });
}

export function exit() {
    return microsoftTeams.authentication.notifySuccess();
    
}
