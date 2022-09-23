import { authentication, app } from "@microsoft/teams-js";
import { getTeamsContext } from "../utilities/teams";
import * as microsoftTeams from "@microsoft/teams-js";

export const auth = {
    id: "00000000-0000-0000-000000000000", //test id
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
    getTeamsContext().then((context: microsoftTeams.Context): void => {
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
