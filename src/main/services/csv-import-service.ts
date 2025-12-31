import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { CityCode, PoiTypeCode } from './db-service-mock';
import { DatabaseServiceFactory } from './db-service-factory';
import { logger } from '../utils/logger';

/**
 * CSV 导入服务类
 */
export class CsvImportService {
  private static instance: CsvImportService;

  private constructor() {}

  public static getInstance(): CsvImportService {
    if (!CsvImportService.instance) {
      CsvImportService.instance = new CsvImportService();
    }
    return CsvImportService.instance;
  }

  /**
   * 解析 CSV 文件
   */
  private parseCSV(content: string): string[][] {
    const lines = content.split('\n').filter((line) => line.trim());
    return lines.map((line) => {
      // 简单的 CSV 解析，支持逗号分隔
      return line.split(',').map((cell) => cell.trim());
    });
  }

  /**
   * 导入城市编码 CSV 文件
   * CSV 格式：中文名,adcode,citycode 或 adcode,citycode,name,center,level
   */
  public async importCityCodes(filePath: string): Promise<number> {
    try {
      logger.info(`开始导入城市编码文件: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`文件不存在: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const rows = this.parseCSV(content);

      // 跳过表头
      const dataRows = rows.slice(1);

      const cityCodes: CityCode[] = dataRows.map((row) => {
        // 兼容两种格式
        // 格式1: 中文名,adcode,citycode
        // 格式2: adcode,citycode,name,center,level
        if (row.length === 3) {
          return {
            name: row[0] || '',
            adcode: row[1] || '',
            citycode: row[2] === '\\N' ? '' : row[2] || '',
            center: '',
            level: '',
          };
        } else {
          return {
            adcode: row[0] || '',
            citycode: row[1] || '',
            name: row[2] || '',
            center: row[3] || '',
            level: row[4] || '',
          };
        }
      });

      // 过滤掉无效数据
      const validCityCodes = cityCodes.filter(
        (city) => city.adcode && city.name
      );

      const dbService = DatabaseServiceFactory.getService() as any;
      const count = await dbService.insertCityCodes(validCityCodes);
      logger.info(`城市编码导入成功，共 ${count} 条`);

      return count;
    } catch (error) {
      logger.error('导入城市编码失败', error);
      throw error;
    }
  }

  /**
   * 导入 POI 分类编码 CSV 文件
   * CSV 格式：序号,NEW_TYPE,大类,中类,小类,... 或 code,name,parentCode,level
   */
  public async importPoiTypeCodes(filePath: string): Promise<number> {
    try {
      logger.info(`开始导入 POI 分类编码文件: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`文件不存在: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const rows = this.parseCSV(content);

      // 跳过表头
      const dataRows = rows.slice(1);

      const typeCodes: PoiTypeCode[] = dataRows.map((row) => {
        // 兼容两种格式
        // 格式1: 序号,NEW_TYPE,大类,中类,小类,...
        // 格式2: code,name,parentCode,level
        if (row.length >= 5 && row[1].match(/^\d{6}$/)) {
          // 格式1：高德标准格式
          const code = row[1];
          const name = row[4] || row[3] || row[2]; // 优先使用小类，其次中类，最后大类
          
          // 根据编码长度判断层级
          let level = 1;
          if (code.endsWith('0000')) {
            level = 1; // 大类
          } else if (code.endsWith('00')) {
            level = 2; // 中类
          } else {
            level = 3; // 小类
          }
          
          // 计算父级编码
          let parentCode: string | undefined;
          if (level === 3) {
            parentCode = code.substring(0, 4) + '00';
          } else if (level === 2) {
            parentCode = code.substring(0, 2) + '0000';
          }
          
          return {
            code,
            name,
            parentCode,
            level,
          };
        } else {
          // 格式2：自定义格式
          return {
            code: row[0] || '',
            name: row[1] || '',
            parentCode: row[2] || undefined,
            level: parseInt(row[3] || '1', 10),
          };
        }
      });

      // 过滤掉无效数据
      const validTypeCodes = typeCodes.filter(
        (type) => type.code && type.name
      );

      const dbService = DatabaseServiceFactory.getService() as any;
      const count = await dbService.insertPoiTypeCodes(validTypeCodes);
      logger.info(`POI 分类编码导入成功，共 ${count} 条`);

      return count;
    } catch (error) {
      logger.error('导入 POI 分类编码失败', error);
      throw error;
    }
  }

  /**
   * 自动加载默认数据（应用启动时调用）
   */
  public async autoLoadDefaultData(): Promise<void> {
    try {
      // 检查是否已有数据
      const dbService = DatabaseServiceFactory.getService() as any;
      const cityCount = await dbService.getCityCodeCount();
      const typeCount = await dbService.getPoiTypeCodeCount();

      if (cityCount > 0 && typeCount > 0) {
        logger.info(
          `数据库已有数据：城市编码 ${cityCount} 条，POI 分类 ${typeCount} 条`
        );
        return;
      }

      logger.info('数据库无数据，开始自动加载默认数据...');

      // 获取资源路径
      // 开发环境：项目根目录/assets/data
      // 生产环境：app.asar/assets/data
      const resourcePath = app.isPackaged
        ? path.join(process.resourcesPath, 'assets', 'data')
        : path.join(app.getAppPath(), 'assets', 'data');

      logger.debug(`资源路径: ${resourcePath}`);

      const cityCodeFile = path.join(resourcePath, 'amap_adcode_citycode.csv');
      const poiTypeFile = path.join(resourcePath, 'amap_poi_typecode.csv');
      
      logger.debug(`城市编码文件路径: ${cityCodeFile}`);
      logger.debug(`POI 分类文件路径: ${poiTypeFile}`);

      // 导入城市编码
      if (fs.existsSync(cityCodeFile)) {
        await this.importCityCodes(cityCodeFile);
      } else {
        logger.warn(`城市编码文件不存在: ${cityCodeFile}`);
      }

      // 导入 POI 分类编码
      if (fs.existsSync(poiTypeFile)) {
        await this.importPoiTypeCodes(poiTypeFile);
      } else {
        logger.warn(`POI 分类编码文件不存在: ${poiTypeFile}`);
      }

      logger.info('默认数据加载完成');
    } catch (error) {
      logger.error('自动加载默认数据失败', error);
      // 不抛出错误，允许应用继续启动
    }
  }

  /**
   * 获取数据统计信息
   */
  public async getDataStats(): Promise<{
    cityCodeCount: number;
    poiTypeCodeCount: number;
  }> {
    const dbService = DatabaseServiceFactory.getService() as any;
    const cityCodeCount = await dbService.getCityCodeCount();
    const poiTypeCodeCount = await dbService.getPoiTypeCodeCount();
    
    return {
      cityCodeCount,
      poiTypeCodeCount,
    };
  }
}
