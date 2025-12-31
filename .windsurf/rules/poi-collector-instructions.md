---
trigger: model_decision
description: 
globs: 
---

# POI Collector App - AI Coding Instructions

## 项目概述

Electron 跨平台桌面应用，使用 React 19 + TypeScript 构建，用于从高德地图 API 采集 POI（兴趣点）数据，支持本地 SQLite 数据库存储和 CSV 导出。

## 架构模式

采用 **Electron 主进程-渲染进程分离** 架构：

### 主进程 (Main Process)
- `src/main/services/` - 业务服务层（AmapService、DatabaseService、ExportService）
- `src/main/ipc/` - IPC 通信处理器（poi-handler、db-handler、export-handler）
- `src/main/utils/` - 工具类（logger、config）
- `src/main/window.ts` - 窗口管理

### 渲染进程 (Renderer Process)
- `src/renderer/pages/` - 页面组件（SearchPage、SavedPOIsPage、BatchCollectPage、SettingsPage）
- `src/renderer/components/` - 通用组件（Layout、POITable、SearchForm）
- `src/renderer/store/` - Redux 状态管理（poiSlice、settingsSlice、collectSlice）
- `src/renderer/hooks/` - 自定义 Hooks（usePOISearch、useDatabase、useBatchCollect）
- `src/renderer/api/` - IPC 通信封装

### 共享代码 (Shared)
- `src/shared/types/` - TypeScript 类型定义（POI、POICategory、CityCode）
- `src/shared/constants/` - 常量定义（IPC 通道名称）
- `src/preload/` - 预加载脚本（contextBridge API 暴露）

## 关键技术约束

### 核心技术栈版本

- **Electron**: ^39.2.7
- **React**: ^19.2.3
- **TypeScript**: ^5.3.0
- **Redux Toolkit**: ^2.3.0
- **Material-UI**: ^6.1.0
- **better-sqlite3**: ^11.5.0
- **electron-store**: ^11.0.2

### Electron 安全配置（必需）

在 `src/main/window.ts` 中配置 BrowserWindow：

```typescript
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,        // 必须禁用
    contextIsolation: true,        // 必须启用
    preload: path.join(__dirname, '../preload/index.js'),
  },
});
```

### IPC 通信规范

- 所有主进程-渲染进程通信必须通过 IPC
- 使用 `contextBridge.exposeInMainWorld` 安全暴露 API
- IPC 通道名称统一定义在 `src/shared/constants/ipc-channels.ts`
- 主进程使用 `ipcMain.handle` 处理异步请求
- 渲染进程使用 `ipcRenderer.invoke` 调用主进程方法

### 数据库配置

- 使用 `better-sqlite3` 进行 SQLite 操作
- 启用 WAL 模式：`db.pragma('journal_mode = WAL')`
- 使用事务批量处理：`db.transaction()`
- 数据库路径：`app.getPath('userData')/data/poi_database.db`

### macOS 权限配置

在 `build/entitlements.mac.plist` 中配置：

```xml
<key>com.apple.security.network.client</key>
<true/>
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
<key>com.apple.security.files.downloads.read-write</key>
<true/>
```

## 高德 API 集成

### API 端点

```
GET https://restapi.amap.com/v5/place/text
```

### 参数规则

- `keywords` 或 `types` 必须二选一填写
- `types` 值来自 [docs/amap_poi_typecode.csv](docs/amap_poi_typecode.csv) 的 `NEW_TYPE` 字段
- `region` 值来自 [docs/amap_adcode_citycode.csv](docs/amap_adcode_citycode.csv)
- API 详细文档参考 [docs/amap-api.md](docs/amap-api.md)

### 响应处理

检查 `status == "1"` 表示成功，解析 `pois` 数组获取结果

## 数据模型字段映射

### POI TypeScript 接口

```typescript
interface POI {
  id: string;
  name: string;
  type: string;
  typeCode: string;
  address: string;
  location: string;
  tel?: string;
  pcode: string;
  pname: string;
  cityname: string;
  adname: string;
  adcode: string;
  citycode: string;
  parent?: string;
  distance?: string;
}
```

### 数据库表结构

```sql
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
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 分别启动
npm run dev:renderer  # 启动前端开发服务器
npm run dev:electron  # 启动 Electron

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建
npm run build         # 构建主进程和渲染进程
npm run build:mac     # 构建 macOS 版本
npm run build:win     # 构建 Windows 版本
npm run build:linux   # 构建 Linux 版本
npm run build:all     # 构建所有平台
```

## 代码约定

### TypeScript 规范

- 所有代码必须使用 TypeScript 编写
- 严格模式：`"strict": true`
- 使用接口定义数据结构
- 避免使用 `any` 类型，优先使用 `unknown`
- 使用 ES6+ 语法（async/await、箭头函数、解构等）

### 设计模式

- **主进程服务类**：使用单例模式（`getInstance()`）
- **React 组件**：优先使用函数组件 + Hooks
- **状态管理**：使用 Redux Toolkit + createSlice
- **异步操作**：使用 createAsyncThunk

### 命名规范

- **文件名**：kebab-case（`amap-service.ts`）
- **组件名**：PascalCase（`SearchPage.tsx`）
- **变量/函数**：camelCase（`searchPOI`）
- **常量**：UPPER_SNAKE_CASE（`IPC_CHANNELS`）
- **接口/类型**：PascalCase（`POI`、`SearchParams`）

### 特殊处理

- **API Key 存储**：使用 `electron-store` 加密存储
- **CSV 导出**：使用 BOM 头 `\uFEFF` 确保中文 Excel 兼容
- **分页查询**：通过 `page_num` 和 `page_size` 参数实现
- **批量采集**：支持断点续采，使用 Redux 状态记录进度
- **错误处理**：所有异步操作必须使用 try-catch
- **日志记录**：使用统一的 logger 工具

### React 最佳实践

- 使用 `React.memo` 优化性能
- 使用 `useMemo` 和 `useCallback` 缓存计算结果
- 大列表使用虚拟滚动（react-window）
- 懒加载路由和组件

### IPC 通信模式

```typescript
// 主进程注册处理器
ipcMain.handle('poi:search', async (event, params) => {
  const service = AmapService.getInstance();
  return await service.searchPOI(params);
});

// 渲染进程调用
const result = await window.electronAPI.searchPOI(params);
```

## 资源文件

- `resources/data/amap_poi_categories.csv` - POI 分类（从 docs/ 复制）
- `resources/data/amap_city_codes.csv` - 城市编码（从 docs/ 复制）
- `resources/icons/` - 应用图标（icon.icns, icon.ico, icon.png）
- `resources/images/` - 图片资源

### 图片资源（docs/）

- `logo.png` - 应用 Logo
- `menu-bottom.jpg` - 菜单底部图
- `image.jpg` - 关于项目底图

## 构建配置

### Webpack 配置要点

- 主进程：`target: 'electron-main'`
- 渲染进程：`target: 'electron-renderer'`
- 预加载脚本：`target: 'electron-preload'`
- 使用 `ts-loader` 编译 TypeScript
- 使用 `sass-loader` 处理 SCSS

### Electron Builder 配置

- 配置文件：`build/electron-builder.json`
- macOS：生成 DMG 和 ZIP
- Windows：生成 NSIS 安装程序和便携版
- Linux：生成 AppImage、deb、rpm

## 安全检查清单

- [ ] `nodeIntegration: false`
- [ ] `contextIsolation: true`
- [ ] 使用 `contextBridge` 暴露 API
- [ ] 验证所有 IPC 输入参数
- [ ] 使用参数化查询防止 SQL 注入
- [ ] API Key 加密存储
- [ ] 定期运行 `npm audit`

## 性能优化检查清单

- [ ] 数据库使用 WAL 模式
- [ ] 批量操作使用事务
- [ ] React 组件使用 memo
- [ ] 大列表使用虚拟滚动
- [ ] 图片懒加载
- [ ] 代码分割和懒加载
- [ ] 生产构建启用压缩

## 常见问题处理

### better-sqlite3 编译失败

```bash
# macOS
brew install python3
npm install --build-from-source

# Windows
npm install --global windows-build-tools
npm install --build-from-source
```

### IPC 通信失败

1. 检查 preload 脚本是否正确加载
2. 验证 contextBridge 是否正确暴露 API
3. 确认 IPC 通道名称一致

### 数据库锁定

```typescript
this.db.pragma('journal_mode = WAL');
this.db.pragma('busy_timeout = 5000');
```
