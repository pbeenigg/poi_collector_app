import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import { DatabaseService } from './services/db-service-mock';
import { CsvImportService } from './services/csv-import-service';
import { registerPOIHandlers } from './ipc/poi-handler';
import { registerExportHandlers } from './ipc/export-handler';
import { registerSettingsHandlers } from './ipc/settings-handler';
import { registerImportHandlers } from './ipc/import-handler';
import { registerSupabaseHandlers } from './ipc/supabase-handler';
import { DatabaseServiceFactory, DatabaseType } from './services/db-service-factory';
import { logger, LogLevel } from './utils/logger';
import Store from 'electron-store';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

/**
 * 应用初始化
 */
async function initialize(): Promise<void> {
  // 设置日志级别
  logger.setLevel(LogLevel.INFO);
  logger.info('应用启动中...');

  // 加载 Supabase 配置并初始化数据库服务
  const supabaseConfig = store.get('supabase') as { url: string; key: string; enabled: boolean } | undefined;
  
  if (supabaseConfig && supabaseConfig.enabled && supabaseConfig.url && supabaseConfig.key) {
    try {
      // 使用 Supabase 模式
      DatabaseServiceFactory.initialize(DatabaseType.SUPABASE, {
        url: supabaseConfig.url,
        key: supabaseConfig.key,
      });
      logger.info('使用 Supabase 数据库模式');
    } catch (error) {
      logger.error('Supabase 初始化失败，切换到本地模式', error);
      DatabaseServiceFactory.initialize(DatabaseType.LOCAL);
    }
  } else {
    // 使用本地模式
    DatabaseServiceFactory.initialize(DatabaseType.LOCAL);
    const dbService = DatabaseService.getInstance();
    dbService.initialize();
    logger.info('使用本地数据库模式');
  }

  // 注册 IPC 处理器
  registerPOIHandlers();
  registerExportHandlers();
  registerSettingsHandlers();
  registerImportHandlers();
  registerSupabaseHandlers();

  // 自动加载城市编码和 POI 分类编码（仅在本地模式下）
  if (!DatabaseServiceFactory.isUsingSupabase()) {
    const importService = CsvImportService.getInstance();
    await importService.autoLoadDefaultData();
  }

  logger.info('应用初始化完成');
}

/**
 * 应用准备就绪
 */
app.whenReady().then(() => {
  initialize();
  mainWindow = createMainWindow();

  // macOS 特定：点击 Dock 图标时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

/**
 * 所有窗口关闭
 */
app.on('window-all-closed', () => {
  // macOS 特定：除非用户明确退出，否则应用保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * 应用退出前清理
 */
app.on('before-quit', () => {
  logger.info('应用退出中...');
  
  // 关闭数据库连接
  const dbService = DatabaseService.getInstance();
  dbService.close();
  
  logger.info('应用已退出');
});

/**
 * 处理未捕获的异常
 */
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('未处理的 Promise 拒绝', reason);
});
