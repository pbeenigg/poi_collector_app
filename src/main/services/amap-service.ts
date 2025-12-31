import axios, { AxiosInstance } from 'axios';
import { POI, SearchParams, AroundSearchParams, AmapResponse } from '../../shared/types/poi';
import { logger } from '../utils/logger';
import { configManager, ApiKeyConfig } from '../utils/config';

/**
 * 高德地图 API 服务类
 */
export class AmapService {
  private static instance: AmapService;
  private axios: AxiosInstance;
  private readonly textSearchUrl = 'https://restapi.amap.com/v5/place/text';
  private readonly aroundSearchUrl = 'https://restapi.amap.com/v5/place/around';

  private constructor() {
    this.axios = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info('高德地图 API 服务初始化完成');
  }

  public static getInstance(): AmapService {
    if (!AmapService.instance) {
      AmapService.instance = new AmapService();
    }
    return AmapService.instance;
  }

  /**
   * 获取当前可用的 API Key
   */
  private getCurrentApiKey(): string {
    const apiKeyConfig = configManager.getCurrentApiKey();
    if (!apiKeyConfig) {
      throw new Error('未配置 API Key，请先在设置中添加 API Key');
    }
    return apiKeyConfig.key;
  }

  /**
   * 获取所有 API Keys
   */
  public getApiKeys(): ApiKeyConfig[] {
    return configManager.getApiKeys();
  }

  /**
   * 添加 API Key
   */
  public addApiKey(apiKey: Omit<ApiKeyConfig, 'usedToday' | 'lastUsed'>): void {
    configManager.addApiKey(apiKey);
    logger.info(`API Key 已添加: ${apiKey.name}`);
  }

  /**
   * 更新 API Key
   */
  public updateApiKey(index: number, updates: Partial<ApiKeyConfig>): void {
    configManager.updateApiKey(index, updates);
  }

  /**
   * 删除 API Key
   */
  public deleteApiKey(index: number): void {
    configManager.deleteApiKey(index);
  }

  /**
   * 获取 API Key 使用统计
   */
  public getApiKeyStats(): Array<{
    name: string;
    usedToday: number;
    dailyLimit: number;
    percentage: number;
    enabled: boolean;
  }> {
    const apiKeys = configManager.getApiKeys();
    return apiKeys.map((key) => ({
      name: key.name,
      usedToday: key.usedToday,
      dailyLimit: key.dailyLimit,
      percentage: (key.usedToday / key.dailyLimit) * 100,
      enabled: key.enabled,
    }));
  }

  /**
   * 搜索 POI
   */
  public async searchPOI(params: SearchParams): Promise<{ pois: POI[]; total: number }> {
    // 获取当前可用的 API Key
    const apiKey = this.getCurrentApiKey();

    // 验证参数
    if (!params.keywords && !params.types) {
      throw new Error('keywords 和 types 参数必须至少提供一个');
    }

    try {
      const requestParams = {
        key: apiKey,
        keywords: params.keywords || '',
        types: params.types || '',
        region: params.region || '',
        city_limit: params.city_limit !== false,
        page_num: params.page_num || 1,
        page_size: params.page_size || 20,
        extensions: params.extensions || 'all',
      };

      logger.debug('发送 POI 搜索请求', requestParams);

      const response = await this.axios.get<AmapResponse>(this.textSearchUrl, {
        params: requestParams,
      });

      const data = response.data;

      // 检查响应状态
      if (data.status !== '1') {
        throw new Error(`API 请求失败: ${data.info} (${data.infocode})`);
      }

      // 记录 API Key 使用
      configManager.recordApiKeyUsage(apiKey);

      const pois = this.transformPOIs(data.pois || []);
      const total = parseInt(data.count || '0', 10);

      logger.info(`搜索成功，返回 ${pois.length} 条结果，总计 ${total} 条`);

      return { pois, total };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('API 请求失败', error.message);
        throw new Error(`网络请求失败: ${error.message}`);
      }
      logger.error('POI 搜索失败', error);
      throw error;
    }
  }

  /**
   * 周边搜索 POI
   */
  public async searchAroundPOI(params: AroundSearchParams): Promise<{ pois: POI[]; total: number }> {
    // 获取当前可用的 API Key
    const apiKey = this.getCurrentApiKey();

    // 验证参数
    if (!params.location) {
      throw new Error('location 参数必须提供');
    }

    // 清理坐标参数（去除空格、制表符等）
    const cleanedLocation = params.location.trim().replace(/\s+/g, '');
    
    // 验证坐标格式
    const locationPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    if (!locationPattern.test(cleanedLocation)) {
      throw new Error('坐标格式不正确，请使用格式：经度,纬度');
    }

    try {
      const requestParams = {
        key: apiKey,
        location: cleanedLocation,
        radius: params.radius || 5000,
        keywords: params.keywords || '',
        types: params.types || '',
        sortrule: params.sortrule || 'distance',
        region: params.region || '',
        city_limit: params.city_limit !== false,
        page_num: params.page_num || 1,
        page_size: params.page_size || 20,
        extensions: params.extensions || 'all',
      };

      logger.debug('发送周边搜索请求', requestParams);

      const response = await this.axios.get<AmapResponse>(this.aroundSearchUrl, {
        params: requestParams,
      });

      const data = response.data;

      // 检查响应状态
      if (data.status !== '1') {
        throw new Error(`API 请求失败: ${data.info} (${data.infocode})`);
      }

      // 记录 API Key 使用
      configManager.recordApiKeyUsage(apiKey);

      const pois = this.transformPOIs(data.pois || []);
      const total = parseInt(data.count || '0', 10);

      logger.info(`周边搜索成功，返回 ${pois.length} 条结果，总计 ${total} 条`);

      return { pois, total };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('API 请求失败', error.message);
        throw new Error(`网络请求失败: ${error.message}`);
      }
      logger.error('周边搜索失败', error);
      throw error;
    }
  }

  /**
   * 转换 POI 数据格式
   */
  private transformPOIs(rawPois: any[]): POI[] {
    return rawPois.map((raw) => this.transformPOI(raw));
  }

  /**
   * 转换单个 POI 数据
   */
  private transformPOI(raw: any): POI {
    return {
      id: raw.id || '',
      name: raw.name || '',
      type: raw.type || '',
      typeCode: raw.typecode || raw.type_code || '',
      address: raw.address || '',
      location: raw.location || '',
      tel: raw.tel || undefined,
      pcode: raw.pcode || '',
      pname: raw.pname || '',
      cityname: raw.cityname || '',
      adname: raw.adname || '',
      adcode: raw.adcode || '',
      citycode: raw.citycode || '',
      parent: raw.parent || undefined,
      distance: raw.distance || undefined,
    };
  }

  /**
   * 批量搜索 POI（支持多个类型和区域）
   */
  public async batchSearch(
    types: string[],
    regions: string[],
    pageSize: number = 20,
    maxPages: number = 10,
    onProgress?: (current: number, total: number) => void
  ): Promise<POI[]> {
    const allPOIs: POI[] = [];
    const total = types.length * regions.length;
    let current = 0;

    for (const type of types) {
      for (const region of regions) {
        current++;
        
        if (onProgress) {
          onProgress(current, total);
        }

        logger.info(`批量采集进度: ${current}/${total} - 类型: ${type}, 区域: ${region}`);

        try {
          // 获取第一页以确定总数
          const firstPage = await this.searchPOI({
            types: type,
            region,
            page_num: 1,
            page_size: pageSize,
          });

          allPOIs.push(...firstPage.pois);

          // 计算需要获取的页数
          const totalPages = Math.min(
            Math.ceil(firstPage.total / pageSize),
            maxPages
          );

          // 获取剩余页面
          for (let page = 2; page <= totalPages; page++) {
            // 添加延迟避免请求过快
            await this.delay(200);

            const pageData = await this.searchPOI({
              types: type,
              region,
              page_num: page,
              page_size: pageSize,
            });

            allPOIs.push(...pageData.pois);
          }
        } catch (error) {
          logger.error(`批量采集失败 - 类型: ${type}, 区域: ${region}`, error);
          // 继续处理下一个，不中断整个批量采集
        }
      }
    }

    logger.info(`批量采集完成，共采集 ${allPOIs.length} 条 POI 数据`);
    return allPOIs;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
