import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';

/**
 * 城市编码接口
 */
export interface CityCode {
  adcode: string;      // 行政区划代码
  citycode: string;    // 城市代码
  name: string;        // 城市名称
  center: string;      // 中心坐标
  level: string;       // 级别（省/市/区）
}

/**
 * POI 分类编码接口
 */
export interface PoiTypeCode {
  code: string;        // 分类编码
  name: string;        // 分类名称
  parentCode?: string; // 父级编码
  level: number;       // 层级（1/2/3）
}

/**
 * 数据库服务类（Mock 版本 - 使用内存存储）
 * 临时解决方案，等待 better-sqlite3 编译问题解决后再切换回真实数据库
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private pois: Map<string, POI> = new Map();
  private cityCodes: Map<string, CityCode> = new Map();
  private poiTypeCodes: Map<string, PoiTypeCode> = new Map();

  private constructor() {
    logger.info('使用内存数据库（Mock 版本）');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * 初始化数据库
   */
  public initialize(): void {
    logger.info('内存数据库初始化成功');
  }

  /**
   * 插入单个 POI
   */
  public insertPOI(poi: POI): void {
    this.pois.set(poi.id, {
      ...poi,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    logger.debug(`POI 已保存到内存: ${poi.name}`);
  }

  /**
   * 批量插入 POI
   */
  public insertBatch(pois: POI[]): number {
    pois.forEach((poi) => this.insertPOI(poi));
    logger.info(`批量保存 ${pois.length} 条 POI 数据到内存`);
    return pois.length;
  }

  /**
   * 获取所有 POI（支持分页）
   */
  public getAllPOIs(limit?: number, offset?: number): POI[] {
    const allPois = Array.from(this.pois.values());
    
    if (limit !== undefined) {
      const start = offset || 0;
      return allPois.slice(start, start + limit);
    }
    
    logger.debug(`从内存查询到 ${allPois.length} 条 POI 数据`);
    return allPois;
  }

  /**
   * 搜索 POI
   */
  public searchPOIs(keyword: string): POI[] {
    const results = Array.from(this.pois.values()).filter(
      (poi) =>
        poi.name.includes(keyword) ||
        poi.address.includes(keyword) ||
        poi.type.includes(keyword)
    );
    
    logger.debug(`搜索 "${keyword}" 在内存中找到 ${results.length} 条结果`);
    return results;
  }

  /**
   * 删除 POI
   */
  public deletePOI(id: string): void {
    this.pois.delete(id);
    logger.debug(`从内存删除 POI: ${id}`);
  }

  /**
   * 获取 POI 总数
   */
  public getCount(): number {
    return this.pois.size;
  }

  /**
   * 清空所有数据
   */
  public clearAll(): void {
    this.pois.clear();
    logger.info('内存中所有 POI 数据已清空');
  }

  /**
   * 关闭数据库连接
   */
  public close(): void {
    logger.info('内存数据库连接已关闭');
  }

  // ==================== 城市编码管理 ====================

  /**
   * 批量插入城市编码
   */
  public insertCityCodes(cityCodes: CityCode[]): number {
    cityCodes.forEach((cityCode) => {
      this.cityCodes.set(cityCode.adcode, cityCode);
    });
    logger.info(`批量保存 ${cityCodes.length} 条城市编码数据到内存`);
    return cityCodes.length;
  }

  /**
   * 获取所有城市编码
   */
  public getAllCityCodes(): CityCode[] {
    return Array.from(this.cityCodes.values());
  }

  /**
   * 分页查询城市编码
   */
  public getCityCodesPage(
    keyword?: string,
    limit: number = 20,
    offset: number = 0
  ): { data: CityCode[]; total: number } {
    let cities = Array.from(this.cityCodes.values());

    // 如果有关键词，进行过滤
    if (keyword && keyword.trim()) {
      cities = cities.filter(
        (city) =>
          city.name.includes(keyword) ||
          city.adcode.includes(keyword) ||
          city.citycode.includes(keyword)
      );
    }

    const total = cities.length;
    const data = cities.slice(offset, offset + limit);

    return { data, total };
  }

  /**
   * 根据 adcode 查询城市
   */
  public getCityByAdcode(adcode: string): CityCode | undefined {
    return this.cityCodes.get(adcode);
  }

  /**
   * 搜索城市（按名称，限制返回数量）
   */
  public searchCities(keyword: string, limit: number = 5): CityCode[] {
    const results = Array.from(this.cityCodes.values()).filter((city) =>
      city.name.includes(keyword)
    );
    return results.slice(0, limit);
  }

  /**
   * 添加或更新城市编码
   */
  public upsertCityCode(cityCode: CityCode): void {
    this.cityCodes.set(cityCode.adcode, cityCode);
    logger.debug(`城市编码已保存: ${cityCode.name}`);
  }

  /**
   * 删除城市编码
   */
  public deleteCityCode(adcode: string): boolean {
    const deleted = this.cityCodes.delete(adcode);
    if (deleted) {
      logger.debug(`城市编码已删除: ${adcode}`);
    }
    return deleted;
  }

  /**
   * 获取城市编码总数
   */
  public getCityCodeCount(): number {
    return this.cityCodes.size;
  }

  /**
   * 清空城市编码
   */
  public clearCityCodes(): void {
    this.cityCodes.clear();
    logger.info('内存中所有城市编码数据已清空');
  }

  // ==================== POI 分类编码管理 ====================

  /**
   * 批量插入 POI 分类编码
   */
  public insertPoiTypeCodes(typeCodes: PoiTypeCode[]): number {
    typeCodes.forEach((typeCode) => {
      this.poiTypeCodes.set(typeCode.code, typeCode);
    });
    logger.info(`批量保存 ${typeCodes.length} 条 POI 分类编码数据到内存`);
    return typeCodes.length;
  }

  /**
   * 获取所有 POI 分类编码
   */
  public getAllPoiTypeCodes(): PoiTypeCode[] {
    return Array.from(this.poiTypeCodes.values());
  }

  /**
   * 分页查询 POI 分类编码
   */
  public getPoiTypeCodesPage(
    keyword?: string,
    limit: number = 20,
    offset: number = 0
  ): { data: PoiTypeCode[]; total: number } {
    let types = Array.from(this.poiTypeCodes.values());

    // 如果有关键词，进行过滤
    if (keyword && keyword.trim()) {
      types = types.filter(
        (type) =>
          type.name.includes(keyword) ||
          type.code.includes(keyword)
      );
    }

    const total = types.length;
    const data = types.slice(offset, offset + limit);

    return { data, total };
  }

  /**
   * 根据 code 查询 POI 分类
   */
  public getPoiTypeByCode(code: string): PoiTypeCode | undefined {
    return this.poiTypeCodes.get(code);
  }

  /**
   * 搜索 POI 分类（按名称，限制返回数量）
   */
  public searchPoiTypes(keyword: string, limit: number = 5): PoiTypeCode[] {
    const results = Array.from(this.poiTypeCodes.values()).filter((type) =>
      type.name.includes(keyword)
    );
    return results.slice(0, limit);
  }

  /**
   * 根据层级获取 POI 分类
   */
  public getPoiTypesByLevel(level: number): PoiTypeCode[] {
    return Array.from(this.poiTypeCodes.values()).filter(
      (type) => type.level === level
    );
  }

  /**
   * 添加或更新 POI 分类编码
   */
  public upsertPoiTypeCode(typeCode: PoiTypeCode): void {
    this.poiTypeCodes.set(typeCode.code, typeCode);
    logger.debug(`POI 分类编码已保存: ${typeCode.name}`);
  }

  /**
   * 删除 POI 分类编码
   */
  public deletePoiTypeCode(code: string): boolean {
    const deleted = this.poiTypeCodes.delete(code);
    if (deleted) {
      logger.debug(`POI 分类编码已删除: ${code}`);
    }
    return deleted;
  }

  /**
   * 获取 POI 分类编码总数
   */
  public getPoiTypeCodeCount(): number {
    return this.poiTypeCodes.size;
  }

  /**
   * 清空 POI 分类编码
   */
  public clearPoiTypeCodes(): void {
    this.poiTypeCodes.clear();
    logger.info('内存中所有 POI 分类编码数据已清空');
  }
}
