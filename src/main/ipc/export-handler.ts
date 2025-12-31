import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { ExportService } from '../services/export-service';
import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';

/**
 * 注册导出相关的 IPC 处理器
 */
export function registerExportHandlers(): void {
  const exportService = ExportService.getInstance();

  // 选择导出路径
  ipcMain.handle(IPC_CHANNELS.EXPORT_SELECT_PATH, async (_, defaultFilename?: string) => {
    try {
      const filePath = await exportService.selectExportPath(defaultFilename);
      return { success: true, data: filePath };
    } catch (error) {
      logger.error('选择导出路径失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '选择路径失败',
      };
    }
  });

  // 导出 CSV
  ipcMain.handle(IPC_CHANNELS.EXPORT_CSV, async (_, pois: POI[], filePath: string) => {
    try {
      logger.info(`导出 ${pois.length} 条数据到 ${filePath}`);
      const result = await exportService.exportToCSV(pois, filePath);
      return { success: true, data: result };
    } catch (error) {
      logger.error('导出 CSV 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  });

  logger.info('导出 IPC 处理器注册完成');
}
