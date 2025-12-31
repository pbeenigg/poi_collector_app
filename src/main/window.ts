import { BrowserWindow, app } from 'electron';
import path from 'path';
import { logger } from './utils/logger';

/**
 * 创建主窗口
 */
export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'POI 数据采集器',
    icon: path.join(__dirname, '../renderer/assets/images/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
    show: false, // 等待加载完成后再显示
  });

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    // 开发模式：加载开发服务器
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    logger.info('主窗口已显示');
  });

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    logger.info('主窗口已关闭');
  });

  return mainWindow;
}
