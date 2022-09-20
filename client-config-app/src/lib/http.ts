import axios from "axios";
import { auth } from "../services/teams";
export const API = axios.create({
    baseURL: process.env.REACT_APP_API_ROOT || "/api/",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // auth,
    transformRequest: (data, headers) => {
        // headers["authorization"] = `${auth.id} ${auth.token}`;
        headers["authorization"] =
            "b614c4c4-2d74-4e56-bc0d-cc0d79b2715f 1663756411131.u8TlauIHpr2mdT9KyrEjZiJxtd5ftEN6TIxCtkVAC3c";
        return JSON.stringify(data);
    },
});
