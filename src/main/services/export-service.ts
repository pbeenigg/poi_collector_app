import { stringify } from 'csv-stringify/sync';
import fs from 'fs';
import path from 'path';
import { dialog } from 'electron';
import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';
import { configManager } from '../utils/config';

/**
 * 导出服务类
 */
export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * 选择导出路径
   */
  public async selectExportPath(defaultFilename: string = 'poi_export.csv'): Promise<string | null> {
    const lastPath = configManager.get('lastExportPath');
    const defaultPath = lastPath || '';

    const result = await dialog.showSaveDialog({
      title: '选择导出路径',
      defaultPath: path.join(defaultPath, defaultFilename),
      filters: [
        { name: 'CSV 文件', extensions: ['csv'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    });

    if (!result.canceled && result.filePath) {
      // 保存最后使用的目录
      const dir = path.dirname(result.filePath);
      configManager.set('lastExportPath', dir);
      return result.filePath;
    }

    return null;
  }

  /**
   * 导出 POI 数据为 CSV
   */
  public async exportToCSV(pois: POI[], filePath: string): Promise<string> {
    try {
      logger.info(`开始导出 ${pois.length} 条数据到 ${filePath}`);

      // 定义 CSV 列
      const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: '名称' },
        { key: 'type', header: '类型' },
        { key: 'typeCode', header: '类型编码' },
        { key: 'address', header: '地址' },
        { key: 'location', header: '坐标' },
        { key: 'tel', header: '电话' },
        { key: 'pcode', header: '省份编码' },
        { key: 'pname', header: '省份' },
        { key: 'citycode', header: '城市编码' },
        { key: 'cityname', header: '城市' },
        { key: 'adcode', header: '区域编码' },
        { key: 'adname', header: '区域' },
        { key: 'parent', header: '父级POI' },
        { key: 'distance', header: '距离' },
      ];

      // 转换数据
      const records = pois.map((poi) => {
        const record: Record<string, string> = {};
        columns.forEach((col) => {
          record[col.key] = (poi[col.key as keyof POI] || '').toString();
        });
        return record;
      });

      // 生成 CSV 内容
      const csvContent = stringify(records, {
        header: true,
        columns: columns.map((col) => ({ key: col.key, header: col.header })),
        bom: true, // 添加 BOM 头，确保 Excel 正确识别中文
      });

      // 写入文件
      fs.writeFileSync(filePath, csvContent, 'utf-8');

      logger.info(`导出成功: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('导出失败', error);
      throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 导出为 JSON
   */
  public async exportToJSON(pois: POI[], filePath: string): Promise<string> {
    try {
      logger.info(`开始导出 ${pois.length} 条数据到 ${filePath}`);

      const jsonContent = JSON.stringify(pois, null, 2);
      fs.writeFileSync(filePath, jsonContent, 'utf-8');

      logger.info(`导出成功: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('导出失败', error);
      throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}
