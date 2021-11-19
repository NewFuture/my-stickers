import { app } from "@microsoft/teams-js";

export const auth = {
    id: '',
    token: '',
}


app.initialize().then(() => { console.debug("teams initialized") });

export function init() {
    auth.token = new URLSearchParams(window.location.search).get('token')!;
    return app.initialize().then(() =>
        app.getContext()
    ).then((context) => {
        console.debug(context);
        auth.id = context.user?.id!;
        return auth
    });
}

export function exit() {
    return app.notifySuccess();
    
}
