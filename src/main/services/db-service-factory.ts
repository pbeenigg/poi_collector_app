import { DatabaseService } from './db-service-mock';
import { SupabaseDatabaseService } from './db-service-supabase';
import { SupabaseClientManager } from './supabase-client';
import { logger } from '../utils/logger';

/**
 * 数据库服务类型
 */
export enum DatabaseType {
  LOCAL = 'local',
  SUPABASE = 'supabase',
}

/**
 * 数据库服务工厂
 * 根据配置返回本地或 Supabase 数据库服务
 */
export class DatabaseServiceFactory {
  private static currentType: DatabaseType = DatabaseType.LOCAL;
  private static localService: DatabaseService;
  private static supabaseService: SupabaseDatabaseService;

  /**
   * 初始化数据库服务
   */
  public static initialize(type: DatabaseType, supabaseConfig?: { url: string; key: string }): void {
    this.currentType = type;

    if (type === DatabaseType.SUPABASE) {
      if (!supabaseConfig) {
        throw new Error('Supabase 配置不能为空');
      }

      // 初始化 Supabase 客户端
      const supabaseManager = SupabaseClientManager.getInstance();
      supabaseManager.initialize(supabaseConfig.url, supabaseConfig.key);

      logger.info('数据库服务切换到 Supabase 模式');
    } else {
      logger.info('数据库服务使用本地模式');
    }
  }

  /**
   * 获取当前数据库服务实例
   */
  public static getService(): DatabaseService | SupabaseDatabaseService {
    if (this.currentType === DatabaseType.SUPABASE) {
      if (!this.supabaseService) {
        this.supabaseService = SupabaseDatabaseService.getInstance();
      }
      return this.supabaseService;
    } else {
      if (!this.localService) {
        this.localService = DatabaseService.getInstance();
      }
      return this.localService;
    }
  }

  /**
   * 获取当前数据库类型
   */
  public static getCurrentType(): DatabaseType {
    return this.currentType;
  }

  /**
   * 检查是否使用 Supabase
   */
  public static isUsingSupabase(): boolean {
    return this.currentType === DatabaseType.SUPABASE;
  }

  /**
   * 切换数据库服务
   */
  public static switchTo(type: DatabaseType, supabaseConfig?: { url: string; key: string }): void {
    this.initialize(type, supabaseConfig);
  }
}
