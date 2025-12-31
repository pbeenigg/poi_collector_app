import { ipcMain, dialog } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { CsvImportService } from '../services/csv-import-service';
import { DatabaseService, CityCode, PoiTypeCode } from '../services/db-service-mock';
import { DatabaseServiceFactory } from '../services/db-service-factory';
import { logger } from '../utils/logger';

/**
 * 注册数据导入相关的 IPC 处理器
 */
export function registerImportHandlers(): void {
  const importService = CsvImportService.getInstance();

  // 选择 CSV 文件
  ipcMain.handle(IPC_CHANNELS.SELECT_CSV_FILE, async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: '选择 CSV 文件',
        filters: [
          { name: 'CSV 文件', extensions: ['csv'] },
          { name: '所有文件', extensions: ['*'] },
        ],
        properties: ['openFile'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }

      return { success: true, filePath: result.filePaths[0] };
    } catch (error) {
      logger.error('选择文件失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '选择文件失败',
      };
    }
  });

  // 导入城市编码
  ipcMain.handle(IPC_CHANNELS.IMPORT_CITY_CODES, async (_, filePath: string) => {
    try {
      logger.info(`导入城市编码 [${filePath}]`);
      const count = await importService.importCityCodes(filePath);
      return { success: true, count };
    } catch (error) {
      logger.error('导入城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导入失败',
      };
    }
  });

  // 导入 POI 分类编码
  ipcMain.handle(IPC_CHANNELS.IMPORT_POI_TYPE_CODES, async (_, filePath: string) => {
    try {
      logger.info(`导入 POI 分类编码 [${filePath}]`);
      const count = await importService.importPoiTypeCodes(filePath);
      return { success: true, count };
    } catch (error) {
      logger.error('导入 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导入失败',
      };
    }
  });

  // 获取数据统计
  ipcMain.handle(IPC_CHANNELS.GET_DATA_STATS, async () => {
    try {
      const stats = await importService.getDataStats();
      return { success: true, data: stats };
    } catch (error) {
      logger.error('获取数据统计失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取统计失败',
      };
    }
  });

  // 获取城市编码数量
  ipcMain.handle(IPC_CHANNELS.GET_CITY_CODE_COUNT, async () => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const count = await dbService.getCityCodeCount();
      return { success: true, count };
    } catch (error) {
      logger.error('获取城市编码数量失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  // ==================== 城市编码管理 ====================

  // 搜索城市编码（用于下拉框）
  ipcMain.handle(IPC_CHANNELS.CITY_CODES_SEARCH, async (_, keyword: string, limit?: number) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const results = await dbService.searchCities(keyword, limit);
      return { success: true, data: results };
    } catch (error) {
      logger.error('搜索城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      };
    }
  });

  // 分页查询城市编码
  ipcMain.handle(IPC_CHANNELS.CITY_CODES_GET_PAGE, async (_, keyword?: string, limit?: number, offset?: number) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const result = await dbService.getCityCodesPage(keyword, limit, offset);
      return { success: true, data: result.data, total: result.total };
    } catch (error) {
      logger.error('分页查询城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      };
    }
  });

  // 获取单个城市编码
  ipcMain.handle(IPC_CHANNELS.CITY_CODE_GET, async (_, adcode: string) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const cityCode = await dbService.getCityByAdcode(adcode);
      return { success: true, data: cityCode };
    } catch (error) {
      logger.error('获取城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  // 添加或更新城市编码
  ipcMain.handle(IPC_CHANNELS.CITY_CODE_UPSERT, async (_, cityCode: CityCode) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      await dbService.upsertCityCode(cityCode);
      return { success: true };
    } catch (error) {
      logger.error('保存城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存失败',
      };
    }
  });

  // 删除城市编码
  ipcMain.handle(IPC_CHANNELS.CITY_CODE_DELETE, async (_, adcode: string) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const deleted = await dbService.deleteCityCode(adcode);
      return { success: deleted };
    } catch (error) {
      logger.error('删除城市编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除失败',
      };
    }
  });

  // ==================== POI 分类编码管理 ====================

  // 搜索 POI 分类编码（用于下拉框）
  ipcMain.handle(IPC_CHANNELS.POI_TYPE_CODES_SEARCH, async (_, keyword: string, limit?: number) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const results = await dbService.searchPoiTypes(keyword, limit);
      return { success: true, data: results };
    } catch (error) {
      logger.error('搜索 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      };
    }
  });

  // 分页查询 POI 分类编码
  ipcMain.handle(IPC_CHANNELS.POI_TYPE_CODES_GET_PAGE, async (_, keyword?: string, limit?: number, offset?: number) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const result = await dbService.getPoiTypeCodesPage(keyword, limit, offset);
      return { success: true, data: result.data, total: result.total };
    } catch (error) {
      logger.error('分页查询 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      };
    }
  });

  // 获取单个 POI 分类编码
  ipcMain.handle(IPC_CHANNELS.POI_TYPE_CODE_GET, async (_, code: string) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const typeCode = await dbService.getPoiTypeByCode(code);
      return { success: true, data: typeCode };
    } catch (error) {
      logger.error('获取 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  // 添加或更新 POI 分类编码
  ipcMain.handle(IPC_CHANNELS.POI_TYPE_CODE_UPSERT, async (_, typeCode: PoiTypeCode) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      await dbService.upsertPoiTypeCode(typeCode);
      return { success: true };
    } catch (error) {
      logger.error('保存 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存失败',
      };
    }
  });

  // 删除 POI 分类编码
  ipcMain.handle(IPC_CHANNELS.POI_TYPE_CODE_DELETE, async (_, code: string) => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const deleted = await dbService.deletePoiTypeCode(code);
      return { success: deleted };
    } catch (error) {
      logger.error('删除 POI 分类编码失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除失败',
      };
    }
  });

  logger.info('数据导入和管理 IPC 处理器注册完成');
}
