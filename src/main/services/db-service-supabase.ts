import { SupabaseClientManager } from './supabase-client';
import { logger } from '../utils/logger';
import { CityCode, PoiTypeCode } from './db-service-mock';

/**
 * POI 数据接口
 */
export interface POI {
  id: string;
  name: string;
  type: string;
  address: string;
  location: string;
  tel?: string;
  cityname?: string;
  adname?: string;
  business_area?: string;
  [key: string]: any;
}

/**
 * Supabase 数据库服务实现
 */
export class SupabaseDatabaseService {
  private static instance: SupabaseDatabaseService;
  private supabaseManager: SupabaseClientManager;

  private constructor() {
    this.supabaseManager = SupabaseClientManager.getInstance();
  }

  public static getInstance(): SupabaseDatabaseService {
    if (!SupabaseDatabaseService.instance) {
      SupabaseDatabaseService.instance = new SupabaseDatabaseService();
    }
    return SupabaseDatabaseService.instance;
  }

  // ==================== POI 数据操作 ====================

  /**
   * 保存单个 POI
   */
  public async savePOI(poi: POI): Promise<void> {
    const client = this.supabaseManager.getClient();
    
    // 转换 camelCase 到 snake_case
    const dbPoi = {
      id: poi.id,
      name: poi.name,
      type: poi.type,
      type_code: poi.typeCode,
      address: poi.address,
      location: poi.location,
      tel: poi.tel,
      pcode: poi.pcode,
      pname: poi.pname,
      cityname: poi.cityname,
      adname: poi.adname,
      adcode: poi.adcode,
      citycode: poi.citycode,
      parent: poi.parent,
      distance: poi.distance,
    };
    
    const { error } = await client.from('pois').upsert(dbPoi, { onConflict: 'id' });
    
    if (error) {
      logger.error('保存 POI 到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.debug(`POI 已保存到 Supabase: ${poi.name}`);
  }

  /**
   * 批量保存 POI
   */
  public async saveBatchPOI(pois: POI[]): Promise<number> {
    const client = this.supabaseManager.getClient();
    
    // 对数据去重，避免同一个 id 被多次插入
    const uniquePois = new Map<string, POI>();
    for (const poi of pois) {
      if (poi.id) {
        uniquePois.set(poi.id, poi);
      }
    }
    
    const deduplicatedPois = Array.from(uniquePois.values());
    
    if (deduplicatedPois.length < pois.length) {
      logger.warn(`批量数据中有重复，原始 ${pois.length} 条，去重后 ${deduplicatedPois.length} 条`);
    }
    
    // 转换 camelCase 到 snake_case
    const dbPois = deduplicatedPois.map(poi => ({
      id: poi.id,
      name: poi.name,
      type: poi.type,
      type_code: poi.typeCode,
      address: poi.address,
      location: poi.location,
      tel: poi.tel,
      pcode: poi.pcode,
      pname: poi.pname,
      cityname: poi.cityname,
      adname: poi.adname,
      adcode: poi.adcode,
      citycode: poi.citycode,
      parent: poi.parent,
      distance: poi.distance,
    }));
    
    const { error } = await client.from('pois').upsert(dbPois, { onConflict: 'id' });
    
    if (error) {
      logger.error('批量保存 POI 到 Supabase 失败', error);
      throw new Error(`批量保存失败: ${error.message}`);
    }
    
    logger.info(`批量保存 ${deduplicatedPois.length} 条 POI 到 Supabase`);
    return deduplicatedPois.length;
  }

  /**
   * 获取所有 POI
   */
  public async getAllPOIs(): Promise<POI[]> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client.from('pois').select('*').order('name');
    
    if (error) {
      logger.error('从 Supabase 获取 POI 失败', error);
      throw new Error(`获取失败: ${error.message}`);
    }
    
    // 转换 snake_case 到 camelCase
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      typeCode: item.type_code,
      address: item.address,
      location: item.location,
      tel: item.tel,
      pcode: item.pcode,
      pname: item.pname,
      cityname: item.cityname,
      adname: item.adname,
      adcode: item.adcode,
      citycode: item.citycode,
      parent: item.parent,
      distance: item.distance,
    }));
  }

  /**
   * 根据 ID 获取 POI
   */
  public async getPOIById(id: string): Promise<POI | null> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client.from('pois').select('*').eq('id', id).single();
    
    if (error) {
      logger.error('从 Supabase 获取 POI 失败', error);
      return null;
    }
    
    if (!data) return null;
    
    // 转换 snake_case 到 camelCase
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      typeCode: data.type_code,
      address: data.address,
      location: data.location,
      tel: data.tel,
      pcode: data.pcode,
      pname: data.pname,
      cityname: data.cityname,
      adname: data.adname,
      adcode: data.adcode,
      citycode: data.citycode,
      parent: data.parent,
      distance: data.distance,
    };
  }

  /**
   * 删除 POI
   */
  public async deletePOI(id: string): Promise<boolean> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('pois').delete().eq('id', id);
    
    if (error) {
      logger.error('从 Supabase 删除 POI 失败', error);
      return false;
    }
    
    logger.debug(`POI 已从 Supabase 删除: ${id}`);
    return true;
  }

  /**
   * 清空所有 POI
   */
  public async clearAllPOIs(): Promise<void> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('pois').delete().neq('id', '');
    
    if (error) {
      logger.error('清空 Supabase POI 失败', error);
      throw new Error(`清空失败: ${error.message}`);
    }
    
    logger.info('Supabase 中所有 POI 已清空');
  }

  // ==================== 城市编码操作 ====================

  /**
   * 批量插入城市编码
   */
  public async insertCityCodes(cityCodes: CityCode[]): Promise<number> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('city_codes').upsert(cityCodes, { onConflict: 'adcode' });
    
    if (error) {
      logger.error('批量保存城市编码到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.info(`批量保存 ${cityCodes.length} 条城市编码到 Supabase`);
    return cityCodes.length;
  }

  /**
   * 分页查询城市编码
   */
  public async getCityCodesPage(
    keyword?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ data: CityCode[]; total: number }> {
    const client = this.supabaseManager.getClient();
    
    let query = client.from('city_codes').select('*', { count: 'exact' });
    
    if (keyword && keyword.trim()) {
      query = query.or(`name.ilike.%${keyword}%,adcode.ilike.%${keyword}%,citycode.ilike.%${keyword}%`);
    }
    
    const { data, error, count } = await query.range(offset, offset + limit - 1).order('name');
    
    if (error) {
      logger.error('从 Supabase 查询城市编码失败', error);
      throw new Error(`查询失败: ${error.message}`);
    }
    
    return { data: data || [], total: count || 0 };
  }

  /**
   * 根据 adcode 查询城市
   */
  public async getCityByAdcode(adcode: string): Promise<CityCode | null> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client.from('city_codes').select('*').eq('adcode', adcode).single();
    
    if (error) {
      return null;
    }
    
    return data;
  }

  /**
   * 搜索城市（按名称，限制返回数量）
   */
  public async searchCities(keyword: string, limit: number = 5): Promise<CityCode[]> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client
      .from('city_codes')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .limit(limit)
      .order('name');
    
    if (error) {
      logger.error('从 Supabase 搜索城市失败', error);
      return [];
    }
    
    return data || [];
  }

  /**
   * 添加或更新城市编码
   */
  public async upsertCityCode(cityCode: CityCode): Promise<void> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('city_codes').upsert(cityCode, { onConflict: 'adcode' });
    
    if (error) {
      logger.error('保存城市编码到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.debug(`城市编码已保存到 Supabase: ${cityCode.name}`);
  }

  /**
   * 删除城市编码
   */
  public async deleteCityCode(adcode: string): Promise<boolean> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('city_codes').delete().eq('adcode', adcode);
    
    if (error) {
      logger.error('从 Supabase 删除城市编码失败', error);
      return false;
    }
    
    logger.debug(`城市编码已从 Supabase 删除: ${adcode}`);
    return true;
  }

  /**
   * 获取城市编码总数
   */
  public async getCityCodeCount(): Promise<number> {
    const client = this.supabaseManager.getClient();
    const { count, error } = await client.from('city_codes').select('*', { count: 'exact', head: true });
    
    if (error) {
      logger.error('从 Supabase 获取城市编码总数失败', error);
      return 0;
    }
    
    return count || 0;
  }

  /**
   * 清空城市编码
   */
  public async clearCityCodes(): Promise<void> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('city_codes').delete().neq('adcode', '');
    
    if (error) {
      logger.error('清空 Supabase 城市编码失败', error);
      throw new Error(`清空失败: ${error.message}`);
    }
    
    logger.info('Supabase 中所有城市编码已清空');
  }

  // ==================== POI 分类编码操作 ====================

  /**
   * 批量插入 POI 分类编码
   */
  public async insertPoiTypeCodes(typeCodes: PoiTypeCode[]): Promise<number> {
    const client = this.supabaseManager.getClient();
    
    // 转换 camelCase 到 snake_case
    const dbTypeCodes = typeCodes.map(tc => ({
      code: tc.code,
      name: tc.name,
      parent_code: tc.parentCode,
      level: tc.level,
    }));
    
    const { error } = await client.from('poi_type_codes').upsert(dbTypeCodes, { onConflict: 'code' });
    
    if (error) {
      logger.error('批量保存 POI 分类编码到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.info(`批量保存 ${typeCodes.length} 条 POI 分类编码到 Supabase`);
    return typeCodes.length;
  }

  /**
   * 分页查询 POI 分类编码
   */
  public async getPoiTypeCodesPage(
    keyword?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ data: PoiTypeCode[]; total: number }> {
    const client = this.supabaseManager.getClient();
    
    let query = client.from('poi_type_codes').select('*', { count: 'exact' });
    
    if (keyword && keyword.trim()) {
      query = query.or(`name.ilike.%${keyword}%,code.ilike.%${keyword}%`);
    }
    
    const { data, error, count } = await query.range(offset, offset + limit - 1).order('code');
    
    if (error) {
      logger.error('从 Supabase 查询 POI 分类编码失败', error);
      throw new Error(`查询失败: ${error.message}`);
    }
    
    // 转换 snake_case 到 camelCase
    const typeCodes = (data || []).map((item: any) => ({
      code: item.code,
      name: item.name,
      parentCode: item.parent_code,
      level: item.level,
    }));
    
    return { data: typeCodes, total: count || 0 };
  }

  /**
   * 根据 code 查询 POI 分类
   */
  public async getPoiTypeByCode(code: string): Promise<PoiTypeCode | null> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client.from('poi_type_codes').select('*').eq('code', code).single();
    
    if (error) {
      return null;
    }
    
    if (!data) return null;
    
    // 转换 snake_case 到 camelCase
    return {
      code: data.code,
      name: data.name,
      parentCode: data.parent_code,
      level: data.level,
    };
  }

  /**
   * 搜索 POI 分类（按名称，限制返回数量）
   */
  public async searchPoiTypes(keyword: string, limit: number = 5): Promise<PoiTypeCode[]> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client
      .from('poi_type_codes')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .limit(limit)
      .order('name');
    
    if (error) {
      logger.error('从 Supabase 搜索 POI 分类失败', error);
      return [];
    }
    
    // 转换 snake_case 到 camelCase
    return (data || []).map((item: any) => ({
      code: item.code,
      name: item.name,
      parentCode: item.parent_code,
      level: item.level,
    }));
  }

  /**
   * 添加或更新 POI 分类编码
   */
  public async upsertPoiTypeCode(typeCode: PoiTypeCode): Promise<void> {
    const client = this.supabaseManager.getClient();
    
    // 转换 camelCase 到 snake_case
    const dbTypeCode = {
      code: typeCode.code,
      name: typeCode.name,
      parent_code: typeCode.parentCode,
      level: typeCode.level,
    };
    
    const { error } = await client.from('poi_type_codes').upsert(dbTypeCode, { onConflict: 'code' });
    
    if (error) {
      logger.error('保存 POI 分类编码到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.debug(`POI 分类编码已保存到 Supabase: ${typeCode.name}`);
  }

  /**
   * 删除 POI 分类编码
   */
  public async deletePoiTypeCode(code: string): Promise<boolean> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('poi_type_codes').delete().eq('code', code);
    
    if (error) {
      logger.error('从 Supabase 删除 POI 分类编码失败', error);
      return false;
    }
    
    logger.debug(`POI 分类编码已从 Supabase 删除: ${code}`);
    return true;
  }

  /**
   * 获取 POI 分类编码总数
   */
  public async getPoiTypeCodeCount(): Promise<number> {
    const client = this.supabaseManager.getClient();
    const { count, error } = await client.from('poi_type_codes').select('*', { count: 'exact', head: true });
    
    if (error) {
      logger.error('从 Supabase 获取 POI 分类编码总数失败', error);
      return 0;
    }
    
    return count || 0;
  }

  /**
   * 清空 POI 分类编码
   */
  public async clearPoiTypeCodes(): Promise<void> {
    const client = this.supabaseManager.getClient();
    const { error } = await client.from('poi_type_codes').delete().neq('code', '');
    
    if (error) {
      logger.error('清空 Supabase POI 分类编码失败', error);
      throw new Error(`清空失败: ${error.message}`);
    }
    
    logger.info('Supabase 中所有 POI 分类编码已清空');
  }

  // ==================== 全局设置操作 ====================

  /**
   * 获取全局设置
   */
  public async getGlobalSettings(): Promise<Record<string, any>> {
    const client = this.supabaseManager.getClient();
    const { data, error } = await client.from('global_settings').select('*');
    
    if (error) {
      logger.error('从 Supabase 获取全局设置失败', error);
      return {};
    }
    
    const settings: Record<string, any> = {};
    (data || []).forEach((item: any) => {
      settings[item.key] = item.value;
    });
    
    return settings;
  }

  /**
   * 保存全局设置
   */
  public async saveGlobalSetting(key: string, value: any): Promise<void> {
    const client = this.supabaseManager.getClient();
    const { error } = await client
      .from('global_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    
    if (error) {
      logger.error('保存全局设置到 Supabase 失败', error);
      throw new Error(`保存失败: ${error.message}`);
    }
    
    logger.debug(`全局设置已保存到 Supabase: ${key}`);
  }
}
