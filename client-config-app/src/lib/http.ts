import axios from "axios";
import { BASE_URL } from "./env";

const SessionKey = window.location.hash;
const USER_SEESION_HEADER = "Session-Key";
export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // auth,
    transformRequest: (data, headers) => {
        headers[USER_SEESION_HEADER] = SessionKey;
        return data;
    },
});
