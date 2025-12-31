import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

/**
 * Supabase 客户端管理器
 */
export class SupabaseClientManager {
  private static instance: SupabaseClientManager;
  private client: SupabaseClient | null = null;
  private supabaseUrl: string | null = null;
  private supabaseKey: string | null = null;

  private constructor() {}

  public static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager();
    }
    return SupabaseClientManager.instance;
  }

  /**
   * 初始化 Supabase 客户端
   */
  public initialize(url: string, key: string): void {
    try {
      this.supabaseUrl = url;
      this.supabaseKey = key;
      this.client = createClient(url, key);
      logger.info('Supabase 客户端初始化成功');
    } catch (error) {
      logger.error('Supabase 客户端初始化失败', error);
      throw error;
    }
  }

  /**
   * 获取 Supabase 客户端
   */
  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase 客户端未初始化，请先配置 Supabase URL 和 API Key');
    }
    return this.client;
  }

  /**
   * 检查是否已初始化
   */
  public isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * 测试连接
   * 返回连接状态和详细信息
   */
  public async testConnection(): Promise<{ success: boolean; message: string; tables?: string[] }> {
    try {
      if (!this.client) {
        return { success: false, message: 'Supabase 客户端未初始化' };
      }

      // 直接测试应用表的访问权限
      const requiredTables = ['pois', 'city_codes', 'poi_type_codes', 'global_settings'];
      const existingTables: string[] = [];
      const missingTables: string[] = [];

      // 逐个测试每个表
      for (const tableName of requiredTables) {
        try {
          const { error } = await this.client
            .from(tableName)
            .select('*', { count: 'exact', head: true })
            .limit(1);

          if (error) {
            // 检查是否是表不存在的错误
            if (error.message.includes('does not exist') || error.code === '42P01') {
              missingTables.push(tableName);
            } else {
              // 其他错误（如权限问题）也认为表存在但有问题
              logger.warn(`表 ${tableName} 存在但查询出错: ${error.message}`);
              existingTables.push(tableName);
            }
          } else {
            existingTables.push(tableName);
          }
        } catch (err) {
          logger.error(`测试表 ${tableName} 时出错`, err);
          missingTables.push(tableName);
        }
      }

      // 如果所有表都缺失，可能是连接问题
      if (existingTables.length === 0 && missingTables.length === requiredTables.length) {
        return {
          success: false,
          message: '无法访问任何表，请检查 Supabase 配置和网络连接',
          tables: []
        };
      }

      // 如果有缺失的表
      if (missingTables.length > 0) {
        return {
          success: true,
          message: `连接成功！已找到 ${existingTables.length} 个表，缺少以下表: ${missingTables.join(', ')}。请在 Supabase 中创建这些表。`,
          tables: existingTables
        };
      }

      // 所有表都存在
      return {
        success: true,
        message: `连接成功！所有必需的表都已创建（${existingTables.length} 个表）`,
        tables: existingTables
      };
    } catch (error) {
      logger.error('Supabase 连接测试失败', error);
      return {
        success: false,
        message: `连接测试异常: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 重置客户端
   */
  public reset(): void {
    this.client = null;
    this.supabaseUrl = null;
    this.supabaseKey = null;
    logger.info('Supabase 客户端已重置');
  }

  /**
   * 获取配置信息
   */
  public getConfig(): { url: string | null; key: string | null } {
    return {
      url: this.supabaseUrl,
      key: this.supabaseKey,
    };
  }
}
