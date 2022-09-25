export const IsAdmin = (idToken: string): boolean => {
    try {
        const directoryRoleTemplateIds = ["62e90394-69f5-4237-9190-012177145e10", "69091246-20e8-4a56-aa4d-066075b2a7a8"];
        const decode = parseJwt(idToken);
        if (decode.wids == null) {
            return false;
        }
        const filteredArray = decode["wids"].filter((value: string) => directoryRoleTemplateIds.includes(value));
        return filteredArray.length > 0;
    }
    catch (e) {
        return false;
    }
}

function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};