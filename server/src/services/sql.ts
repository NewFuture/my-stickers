import { ENV } from "../config";

/**
 * @userId
 */
export const QUERY_SQL = `SELECT
TOP ${ENV.STICKERS_MAX_NUM}
id, name, src, weight, updateAt
FROM ${ENV.SQL_TABEL_NAME}
WHERE userId = @userId
ORDER BY weight DESC
`;

/**
 * @id
 * @userId
 * @src
 * @name
 */
export const INSERT_SQL = `INSERT
INTO ${ENV.SQL_TABEL_NAME} (id,userId,src,name,weight)
VALUES (@id,@userId,@src,@name,@weight)
`;

/**
 * @id
 */
export const DELETE_SQL = `DELETE
FROM ${ENV.SQL_TABEL_NAME}
WHERE id = @id
`;

/**
 * @id
 * @name
 */
export const UPDATE_NAME_SQL = `UPDATE
${ENV.SQL_TABEL_NAME}
SET updateAt = GETDATE()
,name = @name
WHERE id = @id
`;

/**
 * @id
 * @weight
 */
export const UPDATE_WIGHT_SQL = `UPDATE
${ENV.SQL_TABEL_NAME}
SET updateAt = GETDATE()
,weight = @weight
WHERE id = @id
`;
