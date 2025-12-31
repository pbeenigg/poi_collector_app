/**
 * IPC 通道常量定义
 * 用于主进程和渲染进程之间的通信
 */
export const IPC_CHANNELS = {
  // POI 相关
  POI_SEARCH: 'poi:search',
  POI_SEARCH_AROUND: 'poi:searchAround',
  POI_BATCH_COLLECT: 'poi:batchCollect',
  POI_BATCH_COLLECT_STOP: 'poi:batchCollectStop',
  POI_SAVE: 'poi:save',
  POI_SAVE_BATCH: 'poi:saveBatch',
  POI_GET_ALL: 'poi:getAll',
  POI_SEARCH_LOCAL: 'poi:searchLocal',
  POI_DELETE: 'poi:delete',
  POI_GET_COUNT: 'poi:getCount',
  
  // 设置相关
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_SET_API_KEY: 'settings:setApiKey',
  
  // API Key 管理
  API_KEYS_GET_ALL: 'apiKeys:getAll',
  API_KEY_ADD: 'apiKey:add',
  API_KEY_UPDATE: 'apiKey:update',
  API_KEY_DELETE: 'apiKey:delete',
  API_KEYS_GET_STATS: 'apiKeys:getStats',
  
  // 数据导入相关
  IMPORT_CITY_CODES: 'import:cityCodes',
  IMPORT_POI_TYPE_CODES: 'import:poiTypeCodes',
  GET_DATA_STATS: 'import:getDataStats',
  SELECT_CSV_FILE: 'import:selectCsvFile',
  
  // 城市编码管理
  CITY_CODES_SEARCH: 'cityCodes:search',
  CITY_CODES_GET_PAGE: 'cityCodes:getPage',
  CITY_CODE_GET: 'cityCode:get',
  CITY_CODE_UPSERT: 'cityCode:upsert',
  CITY_CODE_DELETE: 'cityCode:delete',
  
  // POI 分类编码管理
  POI_TYPE_CODES_SEARCH: 'poiTypeCodes:search',
  POI_TYPE_CODES_GET_PAGE: 'poiTypeCodes:getPage',
  POI_TYPE_CODE_GET: 'poiTypeCode:get',
  POI_TYPE_CODE_UPSERT: 'poiTypeCode:upsert',
  POI_TYPE_CODE_DELETE: 'poiTypeCode:delete',
  
  // Supabase 配置管理
  SUPABASE_GET_CONFIG: 'supabase:getConfig',
  SUPABASE_SAVE_CONFIG: 'supabase:saveConfig',
  SUPABASE_TEST_CONNECTION: 'supabase:testConnection',
  SUPABASE_SWITCH_MODE: 'supabase:switchMode',
  SUPABASE_GET_MODE: 'supabase:getMode',
  
  // 导出相关
  EXPORT_CSV: 'export:csv',
  EXPORT_SELECT_PATH: 'export:selectPath',
  
  // 批量采集相关
  BATCH_START: 'batch:start',
  BATCH_STOP: 'batch:stop',
  BATCH_PROGRESS: 'batch:progress',
  
  // 数据库相关
  DB_INIT: 'db:init',
  DB_CLOSE: 'db:close',
  
  // 窗口相关
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
} as const;

export type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
