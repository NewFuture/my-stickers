import { authentication, app } from "@microsoft/teams-js";

export const auth = {
    id: "00000000-0000-0000-000000000000", //test id
    token: "",
};

app.initialize().then(() => {
    console.debug("teams initialized");
}, () => {
    console.error("teams not initialize");
});

export function init() {
    auth.id = new URLSearchParams(window.location.search).get("id")!;
    auth.token = window.location.hash.replace("#", "");
    return Promise.resolve(auth);
}

export function exit() {
    return authentication.notifySuccess();
}

export async function getAuthToken(): Promise<string> {
    return authentication.getAuthToken({ silent: false });
}
