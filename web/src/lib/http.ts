
import axios from 'axios';
import { auth } from '../services/teams';
export const API = axios.create({
    baseURL: '/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    // auth,
    transformRequest: (data, headers) => {
        console.log(data, headers)
        headers['authorization'] = `${auth.id} ${auth.token}`;
        return JSON.stringify(data);
    }
});