import Store from 'electron-store';
import { logger } from './logger';

/**
 * API Key 配置接口
 */
export interface ApiKeyConfig {
  key: string;
  name: string;
  dailyLimit: number;
  usedToday: number;
  enabled: boolean;
  lastUsed?: number;
}

/**
 * 应用配置接口
 */
interface AppConfig {
  // API Key 配置（支持多个）
  amapApiKeys?: ApiKeyConfig[];
  currentApiKeyIndex?: number;
  
  // 数据库配置
  dbPath?: string;
  
  // 日志配置
  logLevel?: string;
  
  // 导出配置
  lastExportPath?: string;
  
  // 全局设置
  pageSize?: number;           // 分页条数
  theme?: 'light' | 'dark';    // 主题模式
  primaryColor?: string;       // 主题主色调
  autoSave?: boolean;          // 自动保存搜索结果
  searchDelay?: number;        // 批量搜索延迟（毫秒）
}

/**
 * 配置管理类
 */
class ConfigManager {
  private static instance: ConfigManager;
  private store: Store<AppConfig>;

  private constructor() {
    this.store = new Store<AppConfig>({
      name: 'poi-collector-config',
      defaults: {
        amapApiKeys: [],
        currentApiKeyIndex: 0,
        dbPath: '',
        logLevel: 'info',
        lastExportPath: '',
        pageSize: 20,
        theme: 'light',
        primaryColor: '#1976d2',
        autoSave: false,
        searchDelay: 200,
      },
    });
    logger.info('配置管理器初始化完成');
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 获取配置项
   */
  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.store.get(key);
  }

  /**
   * 设置配置项
   */
  public set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.store.set(key, value);
    logger.debug(`配置项已更新: ${String(key)}`);
  }

  /**
   * 获取所有配置
   */
  public getAll(): AppConfig {
    return this.store.store;
  }

  /**
   * 设置多个配置项
   */
  public setAll(config: Partial<AppConfig>): void {
    Object.entries(config).forEach(([key, value]) => {
      this.store.set(key as keyof AppConfig, value);
    });
    logger.debug('批量配置项已更新');
  }

  /**
   * 重置所有配置
   */
  public reset(): void {
    this.store.clear();
    logger.info('配置已重置');
  }

  // ==================== API Key 管理 ====================

  /**
   * 获取所有 API Keys
   */
  public getApiKeys(): ApiKeyConfig[] {
    return this.store.get('amapApiKeys') || [];
  }

  /**
   * 添加 API Key
   */
  public addApiKey(apiKey: Omit<ApiKeyConfig, 'usedToday' | 'lastUsed'>): void {
    const apiKeys = this.getApiKeys();
    apiKeys.push({
      ...apiKey,
      usedToday: 0,
    });
    this.store.set('amapApiKeys', apiKeys);
    logger.info(`API Key 已添加: ${apiKey.name}`);
  }

  /**
   * 更新 API Key
   */
  public updateApiKey(index: number, updates: Partial<ApiKeyConfig>): void {
    const apiKeys = this.getApiKeys();
    if (index >= 0 && index < apiKeys.length) {
      apiKeys[index] = { ...apiKeys[index], ...updates };
      this.store.set('amapApiKeys', apiKeys);
      logger.debug(`API Key 已更新: ${apiKeys[index].name}`);
    }
  }

  /**
   * 删除 API Key
   */
  public deleteApiKey(index: number): void {
    const apiKeys = this.getApiKeys();
    if (index >= 0 && index < apiKeys.length) {
      const deleted = apiKeys.splice(index, 1);
      this.store.set('amapApiKeys', apiKeys);
      logger.info(`API Key 已删除: ${deleted[0].name}`);
    }
  }

  /**
   * 获取当前可用的 API Key
   */
  public getCurrentApiKey(): ApiKeyConfig | null {
    const apiKeys = this.getApiKeys();
    if (apiKeys.length === 0) return null;

    // 查找可用的 API Key（已启用且未超额度）
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      if (apiKey.enabled && apiKey.usedToday < apiKey.dailyLimit) {
        return apiKey;
      }
    }

    // 如果所有 Key 都超额度，返回第一个启用的
    return apiKeys.find((k) => k.enabled) || null;
  }

  /**
   * 记录 API Key 使用
   */
  public recordApiKeyUsage(key: string): void {
    const apiKeys = this.getApiKeys();
    const index = apiKeys.findIndex((k) => k.key === key);
    
    if (index !== -1) {
      apiKeys[index].usedToday += 1;
      apiKeys[index].lastUsed = Date.now();
      this.store.set('amapApiKeys', apiKeys);
    }
  }

  /**
   * 重置每日使用次数（每天零点调用）
   */
  public resetDailyUsage(): void {
    const apiKeys = this.getApiKeys();
    apiKeys.forEach((apiKey) => {
      apiKey.usedToday = 0;
    });
    this.store.set('amapApiKeys', apiKeys);
    logger.info('API Key 每日使用次数已重置');
  }
}

export const configManager = ConfigManager.getInstance();
