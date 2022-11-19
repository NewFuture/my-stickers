export function IsAdmin(idToken: string) {
    try {
        // https://learn.microsoft.com/en-us/azure/active-directory/roles/permissions-reference#role-template-ids
        // keep it the same with the server side
        // https://github.com/NewFuture/custom-stickers-teams-extension/blob/v2/server.net/Program.cs#L47
        const directoryRoleTemplateIds = [
            "62e90394-69f5-4237-9190-012177145e10", // Global Administrator
            "69091246-20e8-4a56-aa4d-066075b2a7a8", // Teams Administrator
            "29232cdf-9323-42fd-ade2-1d097af3e4de", // Exchange Administrator
            "2b745bdf-0803-4d80-aa65-822c4493daac", // Office Apps Administrator
        ];
        const decode = parseJwt(idToken);
        if (!decode.wids) {
            return false;
        }
        const role = (decode.wids as string[]).find((value) => directoryRoleTemplateIds.includes(value));
        return !!role;
    } catch (e) {
        return false;
    }
}

function parseJwt(token: string) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
    );

    return JSON.parse(jsonPayload);
}
