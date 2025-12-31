import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc-channels';
import { POI, SearchParams } from '../shared/types/poi';

/**
 * 安全地暴露 API 给渲染进程
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // POI 相关
  searchPOI: (params: SearchParams) => ipcRenderer.invoke(IPC_CHANNELS.POI_SEARCH, params),
  searchAroundPOI: (params: any) => ipcRenderer.invoke(IPC_CHANNELS.POI_SEARCH_AROUND, params),
  batchCollectPOI: (params: any) => ipcRenderer.invoke(IPC_CHANNELS.POI_BATCH_COLLECT, params),
  stopBatchCollect: () => ipcRenderer.invoke(IPC_CHANNELS.POI_BATCH_COLLECT_STOP),
  onBatchCollectProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('batch-collect-progress', (_, progress) => callback(progress));
  },
  savePOI: (poi: POI) => ipcRenderer.invoke(IPC_CHANNELS.POI_SAVE, poi),
  saveBatchPOI: (pois: POI[]) => ipcRenderer.invoke(IPC_CHANNELS.POI_SAVE_BATCH, pois),
  getAllPOIs: (limit?: number, offset?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_GET_ALL, limit, offset),
  deletePOI: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.POI_DELETE, id),
  searchLocalPOIs: (keyword: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_SEARCH_LOCAL, keyword),
  getPOICount: () => ipcRenderer.invoke(IPC_CHANNELS.POI_GET_COUNT),
  getCityCodeCount: () => ipcRenderer.invoke(IPC_CHANNELS.CITY_CODES_GET_COUNT),
  getPoiTypeCodeCount: () => ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODES_GET_COUNT),

  // 设置操作
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET),
  setSettings: (settings: Record<string, any>) =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET, settings),
  setApiKey: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_API_KEY, key),

  // API Key 管理
  getAllApiKeys: () => ipcRenderer.invoke(IPC_CHANNELS.API_KEYS_GET_ALL),
  addApiKey: (apiKey: any) => ipcRenderer.invoke(IPC_CHANNELS.API_KEY_ADD, apiKey),
  updateApiKey: (index: number, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.API_KEY_UPDATE, index, updates),
  deleteApiKey: (index: number) => ipcRenderer.invoke(IPC_CHANNELS.API_KEY_DELETE, index),
  getApiKeyStats: () => ipcRenderer.invoke(IPC_CHANNELS.API_KEYS_GET_STATS),

  // 数据导入操作
  selectCsvFile: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_CSV_FILE),
  importCityCodes: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_CITY_CODES, filePath),
  importPoiTypeCodes: (filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_POI_TYPE_CODES, filePath),
  getDataStats: () => ipcRenderer.invoke(IPC_CHANNELS.GET_DATA_STATS),

  // 城市编码管理
  searchCityCodes: (keyword: string, limit?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.CITY_CODES_SEARCH, keyword, limit),
  getCityCodesPage: (keyword?: string, limit?: number, offset?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.CITY_CODES_GET_PAGE, keyword, limit, offset),
  getCityCode: (adcode: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CITY_CODE_GET, adcode),
  upsertCityCode: (cityCode: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.CITY_CODE_UPSERT, cityCode),
  deleteCityCode: (adcode: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CITY_CODE_DELETE, adcode),

  // POI 分类编码管理
  searchPoiTypeCodes: (keyword: string, limit?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODES_SEARCH, keyword, limit),
  getPoiTypeCodesPage: (keyword?: string, limit?: number, offset?: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODES_GET_PAGE, keyword, limit, offset),
  getPoiTypeCode: (code: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODE_GET, code),
  upsertPoiTypeCode: (typeCode: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODE_UPSERT, typeCode),
  deletePoiTypeCode: (code: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.POI_TYPE_CODE_DELETE, code),

  // Supabase 配置管理
  getSupabaseConfig: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SUPABASE_GET_CONFIG),
  saveSupabaseConfig: (config: { url: string; key: string; enabled: boolean }) =>
    ipcRenderer.invoke(IPC_CHANNELS.SUPABASE_SAVE_CONFIG, config),
  testSupabaseConnection: (url: string, key: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SUPABASE_TEST_CONNECTION, url, key),
  switchDatabaseMode: (mode: 'local' | 'supabase') =>
    ipcRenderer.invoke(IPC_CHANNELS.SUPABASE_SWITCH_MODE, mode),
  getDatabaseMode: () =>
    ipcRenderer.invoke(IPC_CHANNELS.SUPABASE_GET_MODE),

  // 导出操作
  exportCSV: (pois: POI[], filePath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXPORT_CSV, pois, filePath),
  selectExportPath: (defaultFilename?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EXPORT_SELECT_PATH, defaultFilename),

  // 批量采集
  startBatchCollect: (params: any) => ipcRenderer.invoke(IPC_CHANNELS.BATCH_START, params),
  stopBatchCollect: () => ipcRenderer.invoke(IPC_CHANNELS.BATCH_STOP),
  onBatchProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.BATCH_PROGRESS, (_, progress) => callback(progress));
  },
});

/**
 * TypeScript 类型定义
 */
declare global {
  interface Window {
    electronAPI: {
      searchPOI: (params: SearchParams) => Promise<any>;
      savePOI: (poi: POI) => Promise<any>;
      saveBatchPOI: (pois: POI[]) => Promise<any>;
      getAllPOIs: (limit?: number, offset?: number) => Promise<any>;
      deletePOI: (id: string) => Promise<any>;
      searchLocalPOIs: (keyword: string) => Promise<any>;
      getPOICount: () => Promise<any>;
      getCityCodeCount: () => Promise<any>;
      getPoiTypeCodeCount: () => Promise<any>;
      getSettings: () => Promise<any>;
      setSettings: (settings: Record<string, any>) => Promise<any>;
      setApiKey: (key: string) => Promise<any>;
      getAllApiKeys: () => Promise<any>;
      addApiKey: (apiKey: any) => Promise<any>;
      updateApiKey: (index: number, updates: any) => Promise<any>;
      deleteApiKey: (index: number) => Promise<any>;
      getApiKeyStats: () => Promise<any>;
      selectCsvFile: () => Promise<any>;
      importCityCodes: (filePath: string) => Promise<any>;
      importPoiTypeCodes: (filePath: string) => Promise<any>;
      getDataStats: () => Promise<any>;
      searchCityCodes: (keyword: string, limit?: number) => Promise<any>;
      getCityCodesPage: (keyword?: string, limit?: number, offset?: number) => Promise<any>;
      getCityCode: (adcode: string) => Promise<any>;
      upsertCityCode: (cityCode: any) => Promise<any>;
      deleteCityCode: (adcode: string) => Promise<any>;
      searchPoiTypeCodes: (keyword: string, limit?: number) => Promise<any>;
      getPoiTypeCodesPage: (keyword?: string, limit?: number, offset?: number) => Promise<any>;
      getPoiTypeCode: (code: string) => Promise<any>;
      upsertPoiTypeCode: (typeCode: any) => Promise<any>;
      deletePoiTypeCode: (code: string) => Promise<any>;
      getSupabaseConfig: () => Promise<any>;
      saveSupabaseConfig: (config: { url: string; key: string; enabled: boolean }) => Promise<any>;
      testSupabaseConnection: (url: string, key: string) => Promise<any>;
      switchDatabaseMode: (mode: 'local' | 'supabase') => Promise<any>;
      getDatabaseMode: () => Promise<any>;
      exportCSV: (pois: POI[], filePath: string) => Promise<any>;
      selectExportPath: (defaultFilename?: string) => Promise<any>;
      startBatchCollect: (params: any) => Promise<any>;
      stopBatchCollect: () => Promise<any>;
      onBatchProgress: (callback: (progress: any) => void) => void;
    };
  }
}
