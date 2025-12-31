# 高德 POI 数据采集应用

## 项目概述

这是一个使用 Electron 构建桌面应用程序，用于从高德开放平台采集 POI（兴趣点）数据。应用支持关键词搜索、数据库存储、批量自动采集以及 CSV 格式导出功能。

## 功能特性

### 核心功能

| 功能模块        | 描述                                                       |
| --------------- | ---------------------------------------------------------- |
| 🔍 **POI 搜索** | 通过关键字、城市、POI 类型查询高德地图 API                 |
| 💾 **本地存储** | 将感兴趣的 POI 数据保存到本地 SQLite,MySQL,Postgres 数据库 |
| 📤 **数据导出** | 将保存的数据导出为 CSV 格式（兼容 Excel）                  |
| ⚙️ **设置管理** | 配置高德 API Key 及应用偏好设置                            |
| 📑 **分页加载** | 支持分页查询和加载更多结果                                 |
| 📑 **批量采集** | 支持按指定筛选条件批量自动分页采集，并需要兼容断点续采     |

### 资源列表

- logo: ![alt text](docs/logo.png)
- 菜单底部图：![alt text](docs/menu-bottom.jpg)
- 关于项目底部图：![alt text](docs/image.jpg)

- 高德 POI 分类与编码： [text](docs/amap_poi_typecode.csv)
- 高德城市编码：[text](docs/amap_adcode_citycode.csv)
- 高德 API: [text](docs/amap-api.md)

### 数据模型

#### POI（兴趣点）

```typescript
interface POI {
  id: string;           // POI 唯一标识
  name: string;         // 名称
  type: string;         // 类型名称
  typeCode: string;     // 类型编码
  address: string;      // 地址
  location: string;     // 坐标 "经度,纬度"
  tel?: string;         // 电话
  pcode: string;        // 省份编码
  pname: string;        // 省份名称
  cityname: string;     // 城市名称
  adname: string;       // 区域名称
  adcode: string;       // 区域编码
  citycode: string;     // 城市编码
  parent?: string;      // 父级 POI
  distance?: string;    // 距离
}
```

#### POI 类别

```typescript
interface POICategory {
  id: string;
  code: string;         // 类别编码
  large: string;        // 大类
  medium: string;       // 中类
  small: string;        // 小类
  bigCategory: string;  // 大类(英文)
  midCategory: string;  // 中类(英文)
  subCategory: string;  // 小类(英文)
}
```

#### 城市编码

```typescript
interface CityCode {
  adcode: string;       // 行政区划编码
  name: string;         // 城市名称
  citycode: string;     // 城市编码
}
```

## 项目结构

```
poi_collector_app/
├── src/
│   ├── main/                        # 主进程
│   │   ├── index.ts                 # 主进程入口
│   │   ├── window.ts                # 窗口管理
│   │   ├── ipc/                     # IPC 通信处理
│   │   │   ├── poi-handler.ts       # POI 相关 IPC
│   │   │   ├── db-handler.ts        # 数据库相关 IPC
│   │   │   └── export-handler.ts    # 导出相关 IPC
│   │   ├── services/                # 主进程服务层
│   │   │   ├── amap-service.ts      # 高德 API 服务
│   │   │   ├── db-service.ts        # 数据库服务
│   │   │   └── export-service.ts    # 导出服务
│   │   └── utils/                   # 主进程工具类
│   │       ├── logger.ts            # 日志工具
│   │       └── config.ts            # 配置管理
│   │
│   ├── renderer/                    # 渲染进程（前端）
│   │   ├── index.html               # HTML 入口
│   │   ├── index.tsx                # React 入口
│   │   ├── App.tsx                  # 应用根组件
│   │   │
│   │   ├── pages/                   # 页面组件
│   │   │   ├── SearchPage.tsx       # 搜索页面
│   │   │   ├── SavedPOIsPage.tsx    # 已保存数据页面
│   │   │   ├── BatchCollectPage.tsx # 批量采集页面
│   │   │   └── SettingsPage.tsx     # 设置页面
│   │   │
│   │   ├── components/              # 通用组件
│   │   │   ├── Layout/              # 布局组件
│   │   │   │   ├── Sidebar.tsx      # 侧边栏
│   │   │   │   └── Header.tsx       # 顶部栏
│   │   │   ├── POITable.tsx         # POI 数据表格
│   │   │   ├── SearchForm.tsx       # 搜索表单
│   │   │   └── ExportDialog.tsx     # 导出对话框
│   │   │
│   │   ├── hooks/                   # 自定义 Hooks
│   │   │   ├── usePOISearch.ts      # POI 搜索逻辑
│   │   │   ├── useDatabase.ts       # 数据库操作
│   │   │   └── useBatchCollect.ts   # 批量采集逻辑
│   │   │
│   │   ├── store/                   # 状态管理
│   │   │   ├── index.ts             # Store 配置
│   │   │   ├── poiSlice.ts          # POI 状态
│   │   │   ├── settingsSlice.ts     # 设置状态
│   │   │   └── collectSlice.ts      # 采集任务状态
│   │   │
│   │   ├── api/                     # API 封装
│   │   │   ├── ipc.ts               # IPC 通信封装
│   │   │   └── types.ts             # 类型定义
│   │   │
│   │   ├── styles/                  # 样式文件
│   │   │   ├── global.scss          # 全局样式
│   │   │   └── variables.scss       # 样式变量
│   │   │
│   │   └── utils/                   # 渲染进程工具
│   │       ├── format.ts            # 格式化工具
│   │       └── validation.ts        # 验证工具
│   │
│   ├── shared/                      # 共享代码
│   │   ├── types/                   # 类型定义
│   │   │   ├── poi.ts               # POI 类型
│   │   │   ├── category.ts          # 类别类型
│   │   │   └── city.ts              # 城市类型
│   │   ├── constants/               # 常量定义
│   │   │   └── ipc-channels.ts      # IPC 通道常量
│   │   └── utils/                   # 共享工具
│   │       └── csv-parser.ts        # CSV 解析
│   │
│   └── preload/                     # 预加载脚本
│       └── index.ts                 # 预加载入口
│
├── resources/                       # 资源文件
│   ├── data/
│   │   ├── amap_poi_categories.csv  # POI 分类数据
│   │   └── amap_city_codes.csv      # 城市编码数据
│   ├── icons/                       # 应用图标
│   └── images/                      # 图片资源
│
├── build/                           # 构建配置
│   └── electron-builder.json        # Electron Builder 配置
│
├── package.json                     # 项目配置
├── tsconfig.json                    # TypeScript 配置
├── webpack.config.js                # Webpack 配置
└── README.md
```

## 技术架构

### 技术栈

| 层级           | 技术选型                      |
| -------------- |---------------------------|
| **桌面框架**   | Electron 39.x             |
| **前端框架**   | React 19.x + TypeScript   |
| **UI 组件库**  | Material-UI (MUI) 5.x     |
| **状态管理**   | Redux Toolkit + RTK Query |
| **样式方案**   | SCSS + Tailwind CSS       |
| **数据库**     | better-sqlite3 (SQLite)   |
| **网络请求**   | Axios                     |
| **构建工具**   | Webpack 5 + TypeScript    |
| **打包工具**   | Electron Builder          |
| **架构模式**   | 主进程-渲染进程分离 + IPC 通信       |
| **本地存储**   | electron-store            |

### 核心依赖

```json
{
  "dependencies": {
    "electron": "^39.2.7",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@mui/material": "^6.1.0",
    "@mui/icons-material": "^6.1.0",
    "@reduxjs/toolkit": "^2.3.0",
    "react-redux": "^9.1.0",
    "axios": "^1.7.0",
    "better-sqlite3": "^11.5.0",
    "electron-store": "^11.0.2",
    "csv-parser": "^3.0.0",
    "csv-stringify": "^6.5.0",
    "date-fns": "^4.1.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/react": "^19.2.3",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^22.21.1",
    "@types/better-sqlite3": "^7.6.0",
    "typescript": "^5.3.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0",
    "ts-loader": "^9.5.0",
    "sass": "^1.69.0",
    "sass-loader": "^13.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "electron-builder": "^26.0.12",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

## 开发环境配置

### 前置要求

- Node.js 22.x 或更高版本
- npm 10.x 或 yarn 1.22.x
- Python 3.x（用于 node-gyp 编译原生模块）
- macOS 12.0 或更高版本（macOS 开发）
- Windows 10 或更高版本（Windows 开发）

### 安装步骤

1. **安装 Node.js 和 npm**

   ```bash
   # 使用 Homebrew (macOS)
   brew install node

   # 或使用 nvm
   nvm install 22
   nvm use 22

   # 验证安装
   node --version
   npm --version
   ```

2. **克隆项目并安装依赖**

   ```bash
   cd poi_collector_app
   npm install
   # 或使用 yarn
   yarn install
   ```

3. **配置环境变量**

   创建 `.env` 文件：
   ```bash
   # 高德 API 配置
   AMAP_API_KEY=your_api_key_here
   
   # 数据库配置
   DB_PATH=./data/poi_database.db
   
   # 日志配置
   LOG_LEVEL=info
   ```

4. **运行应用**
   ```bash
   # 开发模式
   npm run dev
   
   # 或分别启动
   npm run dev:renderer  # 启动前端开发服务器
   npm run dev:electron  # 启动 Electron
   ```

### 开发调试

```bash
# 开发模式（热重载）
npm run dev

# 主进程调试
# 在 VS Code 中使用 F5 启动调试，或使用 Chrome DevTools
npm run dev:main

# 渲染进程调试
# 在 Electron 窗口中按 Cmd+Option+I (macOS) 或 Ctrl+Shift+I (Windows)

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 使用指南

### 1. 配置 API Key

1. 启动应用后，点击侧边栏的 **设置** 图标
2. 在 API Key 输入框中填入您的高德开放平台 Key
3. 点击 **保存** 按钮

### 2. 搜索 POI

1. 点击侧边栏的 **搜索** 图标
2. 输入搜索关键字（如 "肯德基"、"加油站"）
3. 选择城市（如 "北京"、"上海"）
4. 可选：选择 POI 类型进行精确筛选
5. 点击 **搜索** 按钮
6. 在结果列表中：
   - 右键单击可保存单条数据
   - 点击 **保存全部** 可批量保存

### 3. 查看已保存数据

1. 点击侧边栏的 **已保存** 图标
2. 浏览已保存的 POI 列表
3. 支持按名称、城市等字段搜索筛选

### 4. 导出数据

1. 在 **已保存** 页面点击 **导出 CSV**
2. 选择保存位置
3. 导出的文件兼容 Excel，支持中文显示

## 核心代码示例

### 高德 API 服务（主进程）

```typescript
// src/main/services/amap-service.ts
import axios, { AxiosInstance } from 'axios';
import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';

interface SearchParams {
  keywords?: string;
  region?: string;
  types?: string;
  pageSize?: number;
  pageNum?: number;
}

interface AmapResponse {
  status: string;
  info: string;
  pois?: any[];
  count?: string;
}

export class AmapService {
  private static instance: AmapService;
  private axios: AxiosInstance;
  private apiKey: string = '';
  private readonly baseUrl = 'https://restapi.amap.com/v5/place/text';

  private constructor() {
    this.axios = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): AmapService {
    if (!AmapService.instance) {
      AmapService.instance = new AmapService();
    }
    return AmapService.instance;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    logger.info('高德 API Key 已设置');
  }

  public async searchPOI(params: SearchParams): Promise<{
    pois: POI[];
    total: number;
  }> {
    if (!this.apiKey) {
      throw new Error('请先配置高德 API Key');
    }

    if (!params.keywords && !params.types) {
      throw new Error('关键词和类型不能同时为空');
    }

    try {
      const response = await this.axios.get<AmapResponse>(this.baseUrl, {
        params: {
          key: this.apiKey,
          keywords: params.keywords || '',
          region: params.region || '',
          types: params.types || '',
          page_size: params.pageSize || 20,
          page_num: params.pageNum || 1,
        },
      });

      const { data } = response;

      if (data.status === '1') {
        const pois = (data.pois || []).map(this.transformPOI);
        const total = parseInt(data.count || '0', 10);
        
        logger.info(`搜索成功，找到 ${pois.length} 条结果`);
        return { pois, total };
      } else {
        throw new Error(data.info || '搜索失败');
      }
    } catch (error: any) {
      logger.error('POI 搜索失败:', error);
      throw new Error(error.message || '网络请求失败');
    }
  }

  private transformPOI(raw: any): POI {
    return {
      id: raw.id || '',
      name: raw.name || '',
      type: raw.type || '',
      typeCode: raw.typecode || '',
      address: raw.address || '',
      location: raw.location || '',
      tel: raw.tel,
      pcode: raw.pcode || '',
      pname: raw.pname || '',
      cityname: raw.cityname || '',
      adname: raw.adname || '',
      adcode: raw.adcode || '',
      citycode: raw.citycode || '',
      parent: raw.parent,
      distance: raw.distance,
    };
  }
}
```

### 数据库服务（主进程）

```typescript
// src/main/services/db-service.ts
import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { POI } from '../../shared/types/poi';
import { logger } from '../utils/logger';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database | null = null;
  private dbPath: string;

  private constructor() {
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.dbPath = path.join(dbDir, 'poi_database.db');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public initialize(): void {
    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.createTables();
      logger.info(`数据库初始化成功: ${this.dbPath}`);
    } catch (error) {
      logger.error('数据库初始化失败:', error);
      throw error;
    }
  }

  private createTables(): void {
    if (!this.db) return;

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
    `);
  }

  public insertPOI(poi: POI): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO poi (
        id, name, type, typeCode, address, location, tel,
        pcode, pname, cityname, adname, adcode, citycode,
        parent, distance
      ) VALUES (
        @id, @name, @type, @typeCode, @address, @location, @tel,
        @pcode, @pname, @cityname, @adname, @adcode, @citycode,
        @parent, @distance
      )
    `);

    stmt.run(poi);
    logger.info(`POI 已保存: ${poi.name}`);
  }

  public insertBatch(pois: POI[]): number {
    if (!this.db) throw new Error('数据库未初始化');

    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO poi (
        id, name, type, typeCode, address, location, tel,
        pcode, pname, cityname, adname, adcode, citycode,
        parent, distance
      ) VALUES (
        @id, @name, @type, @typeCode, @address, @location, @tel,
        @pcode, @pname, @cityname, @adname, @adcode, @citycode,
        @parent, @distance
      )
    `);

    const insertMany = this.db.transaction((pois: POI[]) => {
      for (const poi of pois) {
        insert.run(poi);
      }
    });

    insertMany(pois);
    logger.info(`批量保存 ${pois.length} 条 POI 数据`);
    return pois.length;
  }

  public getAllPOIs(limit?: number, offset?: number): POI[] {
    if (!this.db) throw new Error('数据库未初始化');

    let query = 'SELECT * FROM poi ORDER BY createdAt DESC';
    if (limit) {
      query += ` LIMIT ${limit}`;
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    return this.db.prepare(query).all() as POI[];
  }

  public searchPOIs(keyword: string): POI[] {
    if (!this.db) throw new Error('数据库未初始化');

    return this.db
      .prepare(`
        SELECT * FROM poi 
        WHERE name LIKE ? OR address LIKE ? OR cityname LIKE ?
        ORDER BY createdAt DESC
      `)
      .all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`) as POI[];
  }

  public deletePOI(id: string): void {
    if (!this.db) throw new Error('数据库未初始化');

    this.db.prepare('DELETE FROM poi WHERE id = ?').run(id);
    logger.info(`POI 已删除: ${id}`);
  }

  public getCount(): number {
    if (!this.db) throw new Error('数据库未初始化');

    const result = this.db.prepare('SELECT COUNT(*) as count FROM poi').get() as { count: number };
    return result.count;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      logger.info('数据库连接已关闭');
    }
  }
}
```

### Redux Store 配置（渲染进程）

```typescript
// src/renderer/store/poiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { POI } from '../../shared/types/poi';
import { ipcRenderer } from '../api/ipc';

interface POIState {
  searchResults: POI[];
  savedPOIs: POI[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

const initialState: POIState = {
  searchResults: [],
  savedPOIs: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,
  hasMore: false,
};

// 异步操作：搜索 POI
export const searchPOI = createAsyncThunk(
  'poi/search',
  async (params: {
    keywords?: string;
    region?: string;
    types?: string;
    pageNum?: number;
  }) => {
    const response = await ipcRenderer.invoke('poi:search', params);
    return response;
  }
);

// 异步操作：保存 POI
export const savePOI = createAsyncThunk(
  'poi/save',
  async (poi: POI) => {
    await ipcRenderer.invoke('poi:save', poi);
    return poi;
  }
);

// 异步操作：批量保存 POI
export const saveBatchPOI = createAsyncThunk(
  'poi/saveBatch',
  async (pois: POI[]) => {
    const count = await ipcRenderer.invoke('poi:saveBatch', pois);
    return count;
  }
);

// 异步操作：获取已保存的 POI
export const fetchSavedPOIs = createAsyncThunk(
  'poi/fetchSaved',
  async () => {
    const pois = await ipcRenderer.invoke('poi:getAll');
    return pois;
  }
);

// 异步操作：删除 POI
export const deletePOI = createAsyncThunk(
  'poi/delete',
  async (id: string) => {
    await ipcRenderer.invoke('poi:delete', id);
    return id;
  }
);

const poiSlice = createSlice({
  name: 'poi',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.currentPage = 1;
      state.totalCount = 0;
      state.hasMore = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 搜索 POI
      .addCase(searchPOI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPOI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.pois;
        state.totalCount = action.payload.total;
        state.hasMore = action.payload.pois.length === state.pageSize;
      })
      .addCase(searchPOI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '搜索失败';
      })
      // 保存 POI
      .addCase(savePOI.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(savePOI.rejected, (state, action) => {
        state.error = action.error.message || '保存失败';
      })
      // 批量保存 POI
      .addCase(saveBatchPOI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveBatchPOI.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(saveBatchPOI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '批量保存失败';
      })
      // 获取已保存的 POI
      .addCase(fetchSavedPOIs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavedPOIs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedPOIs = action.payload;
      })
      .addCase(fetchSavedPOIs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取数据失败';
      })
      // 删除 POI
      .addCase(deletePOI.fulfilled, (state, action) => {
        state.savedPOIs = state.savedPOIs.filter(
          (poi) => poi.id !== action.payload
        );
      });
  },
});

export const { clearSearchResults, clearError, setPage } = poiSlice.actions;
export default poiSlice.reducer;
```

## Electron 应用配置

### IPC 通道定义

```typescript
// src/shared/constants/ipc-channels.ts
export const IPC_CHANNELS = {
  // POI 相关
  POI_SEARCH: 'poi:search',
  POI_SAVE: 'poi:save',
  POI_SAVE_BATCH: 'poi:saveBatch',
  POI_GET_ALL: 'poi:getAll',
  POI_DELETE: 'poi:delete',
  POI_SEARCH_LOCAL: 'poi:searchLocal',
  
  // 设置相关
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_SET_API_KEY: 'settings:setApiKey',
  
  // 导出相关
  EXPORT_CSV: 'export:csv',
  EXPORT_SELECT_PATH: 'export:selectPath',
  
  // 批量采集相关
  BATCH_START: 'batch:start',
  BATCH_STOP: 'batch:stop',
  BATCH_PROGRESS: 'batch:progress',
} as const;
```

### 预加载脚本

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc-channels';

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // POI 操作
  searchPOI: (params: any) => ipcRenderer.invoke(IPC_CHANNELS.POI_SEARCH, params),
  savePOI: (poi: any) => ipcRenderer.invoke(IPC_CHANNELS.POI_SAVE, poi),
  saveBatchPOI: (pois: any[]) => ipcRenderer.invoke(IPC_CHANNELS.POI_SAVE_BATCH, pois),
  getAllPOIs: () => ipcRenderer.invoke(IPC_CHANNELS.POI_GET_ALL),
  deletePOI: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.POI_DELETE, id),
  searchLocalPOIs: (keyword: string) => ipcRenderer.invoke(IPC_CHANNELS.POI_SEARCH_LOCAL, keyword),
  
  // 设置操作
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET),
  setSettings: (settings: any) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET, settings),
  setApiKey: (key: string) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_API_KEY, key),
  
  // 导出操作
  exportCSV: (data: any[], filename: string) => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_CSV, data, filename),
  selectExportPath: () => ipcRenderer.invoke(IPC_CHANNELS.EXPORT_SELECT_PATH),
  
  // 批量采集
  startBatchCollect: (params: any) => ipcRenderer.invoke(IPC_CHANNELS.BATCH_START, params),
  stopBatchCollect: () => ipcRenderer.invoke(IPC_CHANNELS.BATCH_STOP),
  onBatchProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on(IPC_CHANNELS.BATCH_PROGRESS, (_, progress) => callback(progress));
  },
});

// TypeScript 类型定义
declare global {
  interface Window {
    electronAPI: {
      searchPOI: (params: any) => Promise<any>;
      savePOI: (poi: any) => Promise<void>;
      saveBatchPOI: (pois: any[]) => Promise<number>;
      getAllPOIs: () => Promise<any[]>;
      deletePOI: (id: string) => Promise<void>;
      searchLocalPOIs: (keyword: string) => Promise<any[]>;
      getSettings: () => Promise<any>;
      setSettings: (settings: any) => Promise<void>;
      setApiKey: (key: string) => Promise<void>;
      exportCSV: (data: any[], filename: string) => Promise<string>;
      selectExportPath: () => Promise<string | null>;
      startBatchCollect: (params: any) => Promise<void>;
      stopBatchCollect: () => Promise<void>;
      onBatchProgress: (callback: (progress: any) => void) => void;
    };
  }
}
```

## 构建与发布

### package.json 脚本配置

```json
{
  "name": "poi-collector-app",
  "version": "1.0.0",
  "description": "POI 数据采集应用",
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:renderer\" \"npm run dev:electron\"",
    "dev:renderer": "webpack serve --config webpack.renderer.config.js",
    "dev:electron": "wait-on http://localhost:3000 && electron .",
    "build": "npm run build:main && npm run build:renderer",
    "build:main": "webpack --config webpack.main.config.js",
    "build:renderer": "webpack --config webpack.renderer.config.js",
    "build:all": "npm run build && electron-builder -mwl",
    "build:mac": "npm run build && electron-builder --mac",
    "build:win": "npm run build && electron-builder --win",
    "build:linux": "npm run build && electron-builder --linux",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss}\""
  }
}
```

### Electron Builder 配置

```json
// build/electron-builder.json
{
  "appId": "com.yourcompany.poicollector",
  "productName": "POI Collector",
  "copyright": "Copyright © 2025",
  "directories": {
    "output": "release",
    "buildResources": "resources"
  },
  "files": [
    "dist/**/*",
    "resources/**/*",
    "package.json"
  ],
  "mac": {
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      },
      {
        "target": "zip",
        "arch": ["x64", "arm64"]
      }
    ],
    "category": "public.app-category.utilities",
    "icon": "resources/icons/icon.icns",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  },
  "dmg": {
    "contents": [
      {
        "x": 130,
        "y": 220
      },
      {
        "x": 410,
        "y": 220,
        "type": "link",
        "path": "/Applications"
      }
    ],
    "window": {
      "width": 540,
      "height": 380
    }
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "ia32"]
      },
      {
        "target": "portable",
        "arch": ["x64"]
      }
    ],
    "icon": "resources/icons/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  },
  "linux": {
    "target": [
      "AppImage",
      "deb",
      "rpm"
    ],
    "category": "Utility",
    "icon": "resources/icons/"
  }
}
```

### macOS 权限配置

```xml
<!-- build/entitlements.mac.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
  <key>com.apple.security.files.downloads.read-write</key>
  <true/>
</dict>
</plist>
```

### 构建命令

```bash
# 开发模式（热重载）
npm run dev

# 构建所有平台（macOS、Windows、Linux）
npm run build:all

# 只构建 macOS 版本
npm run build:mac

# 只构建 Windows 版本
npm run build:win

# 只构建 Linux 版本
npm run build:linux

# 构建产物位置
# release/
#   ├── POI Collector-1.0.0.dmg          # macOS DMG
#   ├── POI Collector-1.0.0-mac.zip      # macOS ZIP
#   ├── POI Collector Setup 1.0.0.exe   # Windows 安装程序
#   ├── POI Collector 1.0.0.exe         # Windows 便携版
#   ├── POI Collector-1.0.0.AppImage    # Linux AppImage
#   ├── poi-collector-app_1.0.0_amd64.deb # Debian 包
#   └── poi-collector-app-1.0.0.x86_64.rpm # RPM 包
```

## 性能优化

### 主进程优化

- 使用 Worker Threads 处理大量数据计算
- 数据库操作使用事务批量处理
- 实现请求队列和限流机制

### 渲染进程优化

- 使用 React.memo 和 useMemo 减少不必要的重渲染
- 虚拟列表渲染大量数据
- 懒加载和代码分割
- 图片资源压缩和懒加载

### 数据库优化

- 创建适当的索引
- 使用 WAL 模式提高并发性能
- 定期执行 VACUUM 优化数据库

## 安全性

### API Key 存储

- 使用 electron-store 加密存储 API Key
- 不在代码中硬编码敏感信息

### IPC 安全

- 使用 contextBridge 安全暴露 API
- 验证所有 IPC 输入参数
- 禁用 nodeIntegration，启用 contextIsolation

### 数据验证

- 对用户输入进行严格验证
- 防止 SQL 注入（使用参数化查询）
- XSS 防护（React 默认转义）

## 测试策略

### 单元测试

```bash
# 安装测试依赖
npm install --save-dev jest @types/jest ts-jest

# 运行测试
npm test

# 测试覆盖率
npm test -- --coverage
```

### E2E 测试

```bash
# 安装 Playwright
npm install --save-dev @playwright/test

# 运行 E2E 测试
npm run test:e2e
```

## 参考资料

### 官方文档

- [Electron 官方文档](https://www.electronjs.org/docs/latest)
- [React 官方文档](https://react.dev/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Material-UI 文档](https://mui.com/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

### API 文档

- [高德开放平台 POI 搜索 API](https://lbs.amap.com/api/webservice/guide/api/search)
- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3)
- [Electron Builder 文档](https://www.electron.build/)

### 最佳实践

- [Electron 安全最佳实践](https://www.electronjs.org/docs/latest/tutorial/security)
- [React 性能优化](https://react.dev/learn/render-and-commit)
- [TypeScript 最佳实践](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## 常见问题

### 1. 安装依赖失败

**问题**：better-sqlite3 编译失败

**解决**：
```bash
# macOS
brew install python3
npm install --build-from-source

# Windows
npm install --global windows-build-tools
npm install --build-from-source
```

### 2. Electron 启动白屏

**问题**：应用启动后显示白屏

**解决**：
- 检查控制台是否有错误信息
- 确认 webpack 构建成功
- 检查 preload 脚本是否正确加载

### 3. IPC 通信失败

**问题**：渲染进程无法调用主进程方法

**解决**：
- 确认 preload 脚本已正确配置
- 检查 contextBridge 是否正确暴露 API
- 验证 IPC 通道名称是否一致

### 4. 数据库锁定

**问题**：数据库被锁定无法访问

**解决**：
```typescript
// 启用 WAL 模式
this.db.pragma('journal_mode = WAL');

// 设置超时
this.db.pragma('busy_timeout = 5000');
```

### 5. 打包后无法运行

**问题**：打包后的应用无法启动

**解决**：
- 检查 electron-builder 配置
- 确认所有资源文件已打包
- macOS 需要签名和公证

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 编写清晰的代码注释（中文）
- 添加单元测试

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue：[GitHub Issues](https://github.com/yourusername/poi_collector_app/issues)
- Email：your.email@example.com
