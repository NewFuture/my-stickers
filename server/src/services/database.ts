import * as Sql from "mssql";
import { resolve } from "mssql/lib/connectionstring";

import { ENV } from "../config";
import debug = require("debug");
import { Sticker } from "./sticker";
import { QUERY_SQL, INSERT_SQL, DELETE_SQL, UPDATE_NAME_SQL, UPDATE_WIGHT_SQL } from "./sql";

const dbConfig = Object.assign(resolve(ENV.SQL_CONNECT_STRING), { parseJSON: true });


const log = debug("mssql");
const error = debug("error:sql");

const pool = new Sql.ConnectionPool(dbConfig);

const poolConnect = pool.connect();

pool.on("error", err => {
    error(err);
});


const baseTime = +new Date("2019-11-20T11:00:00Z");
function getNewWeight() {
    return Date.now() - baseTime;
}

async function excute<T>(sql: string, vars: Record<string, any>) {
    log("query", sql.replace(/\n/g, " "));
    await poolConnect; // ensures that the pool has been created
    try {

        const request = pool.request();
        // tslint:disable-next-line: forin
        for (const key in vars) {
            request.input(key, vars[key]);
        }
        const result = await request.query<T>(sql);
        log(result);
        return result && result.recordset;
    } catch (err) {
        error("query", err);
        return Promise.reject(err);
    }
}

export function query(userId: string) {
    return excute<Sticker>(QUERY_SQL, { userId });
}

export function insert(id: string, userId: string, src: string, name?: string) {
    return excute(INSERT_SQL, {
        id,
        userId,
        src,
        name,
        weight: getNewWeight()
    });
}

export function del(id: string) {
    return excute(DELETE_SQL, { id });
}

export function updateName(id: string, name: string) {
    return excute(UPDATE_NAME_SQL, { id, name });
}

export function renewWeight(id: string) {
    return excute(UPDATE_WIGHT_SQL, { id, weight: getNewWeight() });
}

export function batchUpdateWeight() {

}
