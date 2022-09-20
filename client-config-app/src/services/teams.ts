import { authentication, app } from "@microsoft/teams-js";

export const auth = {
    id: "",
    token: "",
};

app.initialize().then(() => {
    console.debug("teams initialized");
});

export function init() {
    auth.id = new URLSearchParams(window.location.search).get("id")!;
    auth.token = window.location.hash.replace("#", "");
    return Promise.resolve(auth);
}

export function exit() {
    return authentication.notifySuccess();
}
