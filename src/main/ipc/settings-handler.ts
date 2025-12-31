import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { configManager, ApiKeyConfig } from '../utils/config';
import { AmapService } from '../services/amap-service';
import { DatabaseServiceFactory } from '../services/db-service-factory';
import { logger } from '../utils/logger';

/**
 * 注册设置相关的 IPC 处理器
 */
export function registerSettingsHandlers(): void {
  const amapService = AmapService.getInstance();

  // 获取所有设置
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, async () => {
    try {
      // 优先从数据库获取（Supabase 模式）
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        const dbSettings = await dbService.getGlobalSettings();
        
        // 如果数据库中有设置，使用数据库的；否则使用本地的
        if (dbSettings && Object.keys(dbSettings).length > 0) {
          return { success: true, data: dbSettings };
        }
      }
      
      // 本地模式或数据库无数据时，使用本地配置
      const settings = configManager.getAll();
      return { success: true, data: settings };
    } catch (error) {
      logger.error('获取设置失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取设置失败',
      };
    }
  });

  // 设置配置
  ipcMain.handle(IPC_CHANNELS.SETTINGS_SET, async (_, settings: Record<string, any>) => {
    try {
      // 始终保存到本地（作为备份）
      configManager.setAll(settings);
      
      // 如果使用 Supabase，也保存到云端
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        
        // 将每个设置项保存到 global_settings 表
        for (const [key, value] of Object.entries(settings)) {
          await dbService.saveGlobalSetting(key, value);
        }
        
        logger.info('全局配置已同步到 Supabase');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('保存设置失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存设置失败',
      };
    }
  });

  // ==================== API Key 管理 ====================

  // 获取所有 API Keys
  ipcMain.handle(IPC_CHANNELS.API_KEYS_GET_ALL, async () => {
    try {
      // 优先从数据库获取（Supabase 模式）
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        const settings = await dbService.getGlobalSettings();
        
        if (settings && settings.apiKeys) {
          return { success: true, data: settings.apiKeys };
        }
      }
      
      // 本地模式或数据库无数据时，使用本地配置
      const apiKeys = amapService.getApiKeys();
      return { success: true, data: apiKeys };
    } catch (error) {
      logger.error('获取 API Keys 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  // 添加 API Key
  ipcMain.handle(IPC_CHANNELS.API_KEY_ADD, async (_, apiKey: Omit<ApiKeyConfig, 'usedToday' | 'lastUsed'>) => {
    try {
      // 始终保存到本地（作为备份）
      amapService.addApiKey(apiKey);
      
      // 如果使用 Supabase，也保存到云端
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        const apiKeys = amapService.getApiKeys();
        await dbService.saveGlobalSetting('apiKeys', apiKeys);
        logger.info('API Keys 已同步到 Supabase');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('添加 API Key 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '添加失败',
      };
    }
  });

  // 更新 API Key
  ipcMain.handle(IPC_CHANNELS.API_KEY_UPDATE, async (_, index: number, updates: Partial<ApiKeyConfig>) => {
    try {
      // 始终保存到本地（作为备份）
      amapService.updateApiKey(index, updates);
      
      // 如果使用 Supabase，也保存到云端
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        const apiKeys = amapService.getApiKeys();
        await dbService.saveGlobalSetting('apiKeys', apiKeys);
        logger.info('API Keys 已同步到 Supabase');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('更新 API Key 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新失败',
      };
    }
  });

  // 删除 API Key
  ipcMain.handle(IPC_CHANNELS.API_KEY_DELETE, async (_, index: number) => {
    try {
      // 始终从本地删除
      amapService.deleteApiKey(index);
      
      // 如果使用 Supabase，也从云端删除
      if (DatabaseServiceFactory.isUsingSupabase()) {
        const dbService = DatabaseServiceFactory.getService() as any;
        const apiKeys = amapService.getApiKeys();
        await dbService.saveGlobalSetting('apiKeys', apiKeys);
        logger.info('API Keys 已同步到 Supabase');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('删除 API Key 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除失败',
      };
    }
  });

  // 获取 API Key 使用统计
  ipcMain.handle(IPC_CHANNELS.API_KEYS_GET_STATS, async () => {
    try {
      const stats = amapService.getApiKeyStats();
      return { success: true, data: stats };
    } catch (error) {
      logger.error('获取 API Key 统计失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取统计失败',
      };
    }
  });

  logger.info('设置 IPC 处理器注册完成');
}
