import axios from "axios";
import { auth } from "../services/teams";
import { BASE_URL } from "./env";
export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // auth,
    transformRequest: (data, headers) => {
        headers["authorization"] = `${auth.id} ${auth.token}`;
        return JSON.stringify(data);
    },
});
