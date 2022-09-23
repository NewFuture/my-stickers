import { authentication, app, Context } from "@microsoft/teams-js";
import { getTeamsContext } from "../utilities/teams";

export const auth = {
    id: "b798ffd4-6841-426b-a8b1-bf1cfed2d691", //test id
    token: "",
};

app.initialize().then(
    () => {
        console.debug("teams initialized");
    },
    () => {
        console.error("teams not initialize");
    },
);

export function init() {
    getTeamsContext().then((context: Context): void => {
        auth.id = context.userObjectId!;
    });

    return Promise.resolve(auth);
}

export function exit() {
    return authentication.notifySuccess();
}

export async function getAuthToken(): Promise<string> {
    return authentication.getAuthToken({ silent: false });
}
