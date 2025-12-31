import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { DatabaseServiceFactory, DatabaseType } from '../services/db-service-factory';
import { SupabaseClientManager } from '../services/supabase-client';
import { logger } from '../utils/logger';
import Store from 'electron-store';

const store = new Store();

/**
 * 注册 Supabase 配置相关的 IPC 处理器
 */
export function registerSupabaseHandlers(): void {
  // 获取 Supabase 配置
  ipcMain.handle(IPC_CHANNELS.SUPABASE_GET_CONFIG, async () => {
    try {
      const config = store.get('supabase', {
        url: '',
        key: '',
        enabled: false,
      }) as { url: string; key: string; enabled: boolean };

      return { success: true, data: config };
    } catch (error) {
      logger.error('获取 Supabase 配置失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取配置失败',
      };
    }
  });

  // 保存 Supabase 配置
  ipcMain.handle(
    IPC_CHANNELS.SUPABASE_SAVE_CONFIG,
    async (_, config: { url: string; key: string; enabled: boolean }) => {
      try {
        // 保存配置到本地存储
        store.set('supabase', config);

        // 如果启用了 Supabase，初始化客户端
        if (config.enabled && config.url && config.key) {
          const supabaseManager = SupabaseClientManager.getInstance();
          supabaseManager.initialize(config.url, config.key);

          // 切换到 Supabase 模式
          DatabaseServiceFactory.switchTo(DatabaseType.SUPABASE, {
            url: config.url,
            key: config.key,
          });

          logger.info('Supabase 配置已保存并启用');
        } else {
          // 切换回本地模式
          DatabaseServiceFactory.switchTo(DatabaseType.LOCAL);
          logger.info('已切换回本地数据库模式');
        }

        return { success: true };
      } catch (error) {
        logger.error('保存 Supabase 配置失败', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '保存配置失败',
        };
      }
    }
  );

  // 测试 Supabase 连接
  ipcMain.handle(IPC_CHANNELS.SUPABASE_TEST_CONNECTION, async (_, url: string, key: string) => {
    try {
      const supabaseManager = SupabaseClientManager.getInstance();
      
      // 临时初始化客户端进行测试
      const originalConfig = supabaseManager.getConfig();
      supabaseManager.initialize(url, key);
      
      const testResult = await supabaseManager.testConnection();
      
      // 恢复原配置
      if (originalConfig.url && originalConfig.key) {
        supabaseManager.initialize(originalConfig.url, originalConfig.key);
      } else {
        supabaseManager.reset();
      }

      return { 
        success: true, 
        connected: testResult.success,
        message: testResult.message,
        tables: testResult.tables
      };
    } catch (error) {
      logger.error('测试 Supabase 连接失败', error);
      return {
        success: false,
        connected: false,
        message: error instanceof Error ? error.message : '连接测试失败',
      };
    }
  });

  // 切换数据库模式
  ipcMain.handle(IPC_CHANNELS.SUPABASE_SWITCH_MODE, async (_, mode: 'local' | 'supabase') => {
    try {
      if (mode === 'supabase') {
        const config = store.get('supabase') as { url: string; key: string; enabled: boolean };
        
        if (!config || !config.url || !config.key) {
          throw new Error('Supabase 配置不完整，请先配置 Supabase');
        }

        DatabaseServiceFactory.switchTo(DatabaseType.SUPABASE, {
          url: config.url,
          key: config.key,
        });
      } else {
        DatabaseServiceFactory.switchTo(DatabaseType.LOCAL);
      }

      return { success: true };
    } catch (error) {
      logger.error('切换数据库模式失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '切换模式失败',
      };
    }
  });

  // 获取当前数据库模式
  ipcMain.handle(IPC_CHANNELS.SUPABASE_GET_MODE, async () => {
    try {
      const currentType = DatabaseServiceFactory.getCurrentType();
      return {
        success: true,
        mode: currentType === DatabaseType.SUPABASE ? 'supabase' : 'local',
      };
    } catch (error) {
      logger.error('获取数据库模式失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取模式失败',
      };
    }
  });

  logger.info('Supabase 配置 IPC 处理器注册完成');
}
