import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc-channels';
import { AmapService } from '../services/amap-service';
import { DatabaseServiceFactory } from '../services/db-service-factory';
import { SearchParams, AroundSearchParams, POI, BatchCollectParams } from '../../shared/types/poi';
import { logger } from '../utils/logger';

// 批量采集状态管理
let batchCollectRunning = false;
let batchCollectAborted = false;

/**
 * 注册 POI 相关的 IPC 处理器
 */
export function registerPOIHandlers(): void {
  const amapService = AmapService.getInstance();

  // POI 关键字搜索
  ipcMain.handle(IPC_CHANNELS.POI_SEARCH, async (_, params: SearchParams) => {
    try {
      logger.info('收到 POI 搜索请求', params);
      const result = await amapService.searchPOI(params);
      return { success: true, data: result };
    } catch (error) {
      logger.error('POI 搜索失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      };
    }
  });

  // POI 周边搜索
  ipcMain.handle(IPC_CHANNELS.POI_SEARCH_AROUND, async (_, params: AroundSearchParams) => {
    try {
      logger.info('收到周边搜索请求', params);
      const result = await amapService.searchAroundPOI(params);
      return { success: true, data: result };
    } catch (error) {
      logger.error('周边搜索失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      };
    }
  });

  // 批量采集 POI
  ipcMain.handle(IPC_CHANNELS.POI_BATCH_COLLECT, async (event, params: BatchCollectParams) => {
    try {
      logger.info('开始批量采集 POI', params);
      
      batchCollectRunning = true;
      batchCollectAborted = false;
      
      const allPOIs: POI[] = [];
      const { types, regions, pageSize, maxPages = 25, delay = 1000 } = params;
      
      const totalTasks = types.length * regions.length;
      let completedTasks = 0;
      let failedTasks = 0;
      
      // 遍历所有类型和区域组合
      for (const type of types) {
        for (const region of regions) {
          if (batchCollectAborted) {
            logger.info('批量采集已中止');
            break;
          }
          
          try {
            // 分页采集
            for (let page = 1; page <= maxPages; page++) {
              if (batchCollectAborted) break;
              
              const searchParams: SearchParams = {
                types: type,
                region: region,
                page_num: page,
                page_size: pageSize,
              };
              
              const result = await amapService.searchPOI(searchParams);
              
              if (result.pois.length === 0) {
                break; // 没有更多数据
              }
              
              allPOIs.push(...result.pois);
              
              // 发送进度更新
              event.sender.send('batch-collect-progress', {
                current: completedTasks,
                total: totalTasks,
                collected: allPOIs.length,
                currentTask: `${type} - ${region} - 第${page}页`,
              });
              
              // 延迟避免请求过快
              if (page < maxPages && result.pois.length === pageSize) {
                await new Promise(resolve => setTimeout(resolve, delay));
              }
              
              if (result.pois.length < pageSize) {
                break; // 最后一页
              }
            }
            
            completedTasks++;
          } catch (error) {
            logger.error(`采集失败: ${type} - ${region}`, error);
            failedTasks++;
            completedTasks++;
          }
        }
        
        if (batchCollectAborted) break;
      }
      
      batchCollectRunning = false;
      
      logger.info(`批量采集完成，共采集 ${allPOIs.length} 条数据，失败 ${failedTasks} 个任务`);
      
      return {
        success: true,
        data: {
          pois: allPOIs,
          total: allPOIs.length,
          completed: completedTasks,
          failed: failedTasks,
          aborted: batchCollectAborted,
        },
      };
    } catch (error) {
      batchCollectRunning = false;
      logger.error('批量采集失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '批量采集失败',
      };
    }
  });

  // 停止批量采集
  ipcMain.handle(IPC_CHANNELS.POI_BATCH_COLLECT_STOP, async () => {
    try {
      if (batchCollectRunning) {
        batchCollectAborted = true;
        logger.info('收到停止批量采集请求');
        return { success: true, message: '正在停止批量采集...' };
      }
      return { success: true, message: '没有正在运行的批量采集任务' };
    } catch (error) {
      logger.error('停止批量采集失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '停止失败',
      };
    }
  });

  // 保存单个 POI
  ipcMain.handle(IPC_CHANNELS.POI_SAVE, async (_, poi: POI) => {
    try {
      logger.info('保存 POI', poi.name);
      const dbService = DatabaseServiceFactory.getService() as any;
      await dbService.savePOI(poi);
      return { success: true };
    } catch (error) {
      logger.error('保存 POI 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存失败',
      };
    }
  });

  // 批量保存 POI
  ipcMain.handle(IPC_CHANNELS.POI_SAVE_BATCH, async (_, pois: POI[]) => {
    try {
      logger.info(`批量保存 ${pois.length} 条 POI`);
      const dbService = DatabaseServiceFactory.getService() as any;
      const count = await dbService.saveBatchPOI(pois);
      return { success: true, data: count };
    } catch (error) {
      logger.error('批量保存 POI 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '批量保存失败',
      };
    }
  });

  // 获取所有 POI
  ipcMain.handle(IPC_CHANNELS.POI_GET_ALL, async (_, limit?: number, offset?: number) => {
    try {
      logger.info('获取所有 POI', { limit, offset });
      const dbService = DatabaseServiceFactory.getService() as any;
      const pois = await dbService.getAllPOIs();
      return { success: true, data: pois };
    } catch (error) {
      logger.error('获取 POI 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  // 本地搜索 POI
  ipcMain.handle(IPC_CHANNELS.POI_SEARCH_LOCAL, async (_, keyword: string) => {
    try {
      logger.info('本地搜索 POI', keyword);
      const dbService = DatabaseServiceFactory.getService() as any;
      const pois = await dbService.getAllPOIs();
      // 在内存中过滤
      const filtered = pois.filter((poi: any) => 
        poi.name?.includes(keyword) || poi.address?.includes(keyword)
      );
      return { success: true, data: filtered };
    } catch (error) {
      logger.error('本地搜索失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败',
      };
    }
  });

  // 删除 POI
  ipcMain.handle(IPC_CHANNELS.POI_DELETE, async (_, id: string) => {
    try {
      logger.info('删除 POI', id);
      const dbService = DatabaseServiceFactory.getService() as any;
      await dbService.deletePOI(id);
      return { success: true };
    } catch (error) {
      logger.error('删除 POI 失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除失败',
      };
    }
  });

  // 获取 POI 总数
  ipcMain.handle(IPC_CHANNELS.POI_GET_COUNT, async () => {
    try {
      const dbService = DatabaseServiceFactory.getService() as any;
      const pois = await dbService.getAllPOIs();
      return { success: true, data: pois.length };
    } catch (error) {
      logger.error('获取 POI 总数失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取失败',
      };
    }
  });

  logger.info('POI IPC 处理器注册完成');
}
