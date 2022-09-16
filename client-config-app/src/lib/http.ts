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
        // console.log(data, headers)
        headers["authorization"] = `${auth.id} ${auth.token}`;
        return JSON.stringify(data);
    },
});
