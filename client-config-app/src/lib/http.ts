import axios from "axios";
import { BASE_URL } from "./env";

const SessionKey = window.location.hash?.substring(1);
const USER_SEESION_HEADER = "Session-Key";

export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((c) => {
    c.headers[USER_SEESION_HEADER] = SessionKey;
    return c;
});
