/**
 * 图片个数限制
 */
export const MAX_NUM = 150;

/**
 * 批量Commit数量
 */
export const MAX_BATCH_COUNT = 12;

/**
 * 最大并发数量
 */
export const MAX_CONCURRENCY = 6;

/**
 * 修改操作最大并发数
 */
export const MAX_WRITE_CONCURRENCY = 2;

/**
 * Enable / disable the tenant features.
 */
export const ENABLE_TENANT = true;

/**
 * API 地址
 */
export const BASE_URL = (process.env.REACT_APP_API_ROOT || "") + "/api/";

/**
 * AAD Client ID
 */
export const AAD_ID = process.env.REACT_APP_AAD_ID;

/**
 * Query Params when APP start
 */
export const INIT_QUERY = new URLSearchParams(window.location.search);
