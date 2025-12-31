import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';

/**
 * 数据库服务类
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database | null = null;
  private dbPath: string;

  private constructor() {
    const userDataPath = app.getPath('userData');
    const dataDir = path.join(userDataPath, 'data');
    
    // 确保数据目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.dbPath = path.join(dataDir, 'poi_database.db');
    logger.info(`数据库路径: ${this.dbPath}`);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * 初始化数据库
   */
  public initialize(): void {
    try {
      this.db = new Database(this.dbPath);
      
      // 启用 WAL 模式提高并发性能
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('busy_timeout = 5000');
      this.db.pragma('synchronous = NORMAL');
      
      this.createTables();
      logger.info('数据库初始化成功');
    } catch (error) {
      logger.error('数据库初始化失败', error);
      throw error;
    }
  }

  /**
   * 创建数据表
   */
  private createTables(): void {
    if (!this.db) throw new Error('数据库未初始化');

    // 创建 POI 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS poi (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        typeCode TEXT,
        address TEXT,
        location TEXT,
        tel TEXT,
        pcode TEXT,
        pname TEXT,
        cityname TEXT,
        adname TEXT,
        adcode TEXT,
        citycode TEXT,
        parent TEXT,
        distance TEXT,
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_poi_name ON poi(name);
      CREATE INDEX IF NOT EXISTS idx_poi_cityname ON poi(cityname);
      CREATE INDEX IF NOT EXISTS idx_poi_typeCode ON poi(typeCode);
      CREATE INDEX IF NOT EXISTS idx_poi_adcode ON poi(adcode);
    `);

    logger.info('数据表创建成功');
  }

  /**
   * 插入单个 POI
   */
  public insertPOI(poi: POI): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO poi (
        id, name, type, typeCode, address, location, tel,
        pcode, pname, cityname, adname, adcode, citycode,
        parent, distance, updatedAt
      ) VALUES (
        @id, @name, @type, @typeCode, @address, @location, @tel,
        @pcode, @pname, @cityname, @adname, @adcode, @citycode,
        @parent, @distance, strftime('%s', 'now')
      )
    `);

    stmt.run(poi);
    logger.debug(`POI 已保存: ${poi.name}`);
  }

  /**
   * 批量插入 POI（使用事务）
   */
  public insertBatch(pois: POI[]): number {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO poi (
        id, name, type, typeCode, address, location, tel,
        pcode, pname, cityname, adname, adcode, citycode,
        parent, distance, updatedAt
      ) VALUES (
        @id, @name, @type, @typeCode, @address, @location, @tel,
        @pcode, @pname, @cityname, @adname, @adcode, @citycode,
        @parent, @distance, strftime('%s', 'now')
      )
    `);

    const insertMany = this.db.transaction((pois: POI[]) => {
      for (const poi of pois) {
        stmt.run(poi);
      }
    });

    insertMany(pois);
    logger.info(`批量保存 ${pois.length} 条 POI 数据`);
    return pois.length;
  }

  /**
   * 获取所有 POI（支持分页）
   */
  public getAllPOIs(limit?: number, offset?: number): POI[] {
    if (!this.db) throw new Error('数据库未初始化');

    let query = 'SELECT * FROM poi ORDER BY createdAt DESC';
    const params: number[] = [];

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
      
      if (offset !== undefined) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as POI[];
    
    logger.debug(`查询到 ${rows.length} 条 POI 数据`);
    return rows;
  }

  /**
   * 搜索 POI
   */
  public searchPOIs(keyword: string): POI[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      SELECT * FROM poi
      WHERE name LIKE ? OR address LIKE ? OR type LIKE ?
      ORDER BY createdAt DESC
      LIMIT 1000
    `);

    const searchTerm = `%${keyword}%`;
    const rows = stmt.all(searchTerm, searchTerm, searchTerm) as POI[];
    
    logger.debug(`搜索 "${keyword}" 找到 ${rows.length} 条结果`);
    return rows;
  }

  /**
   * 删除 POI
   */
  public deletePOI(id: string): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('DELETE FROM poi WHERE id = ?');
    const result = stmt.run(id);
    
    logger.debug(`删除 POI: ${id}, 影响行数: ${result.changes}`);
  }

  /**
   * 获取 POI 总数
   */
  public getCount(): number {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM poi');
    const result = stmt.get() as { count: number };
    
    return result.count;
  }

  /**
   * 清空所有数据
   */
  public clearAll(): void {
    if (!this.db) throw new Error('数据库未初始化');

    this.db.exec('DELETE FROM poi');
    logger.info('所有 POI 数据已清空');
  }

  /**
   * 关闭数据库连接
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      logger.info('数据库连接已关闭');
    }
  }
}
