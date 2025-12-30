# POI Collector App - AI Coding Instructions

## 项目概述

Flutter macOS 桌面应用，用于从高德地图 API 采集 POI（兴趣点）数据，支持本地数据库存储（SQLite/MySQL/Postgres）和 CSV 导出。

## 架构模式

采用 **MVVM** 架构：

- `models/` - 数据模型（POI、POICategory、CityCode）
- `services/` - API 客户端（AmapClient）和错误处理
- `data/` - 数据库管理（DBManager，支持多种数据库）和导出功能
- `viewmodels/` - 状态管理（使用 Provider/ChangeNotifier）
- `views/` - UI 视图层

## 关键技术约束

### macOS 平台特殊配置

- SQLite 数据库必须使用 `sqflite_common_ffi`（非标准 sqflite）
- 初始化时调用 `sqfliteFfiInit()` 和 `databaseFactory = databaseFactoryFfi`
- 使用 `macos_ui` 包实现原生 macOS 风格

### 多数据库支持

- **SQLite** - 本地轻量存储，默认选项
- **MySQL/Postgres** - 远程数据库，需配置连接参数

### Entitlements 权限（必需）

在 `macos/Runner/*.entitlements` 中配置：

```xml
<key>com.apple.security.network.client</key>
<true/>
<key>com.apple.security.files.user-selected.read-write</key>
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

POI 模型需包含：`id`, `name`, `type`, `typecode`, `address`, `location`, `tel`, `pcode`, `pname`, `cityname`, `adname`, `adcode`, `citycode`, `parent`, `distance`

## 开发命令

```bash
flutter config --enable-macos-desktop  # 首次启用 macOS 支持
flutter pub get                         # 安装依赖
flutter run -d macos                    # 运行应用
flutter build macos --release           # 构建发布版
```

## 代码约定

- 服务类使用单例模式（`factory` + `_instance`）
- API Key 存储在 `shared_preferences`
- CSV 导出使用 BOM 头 `\uFEFF` 确保中文 Excel 兼容
- 分页查询通过 `page_num` 和 `page_size` 参数实现
- 批量采集需支持断点续采（记录采集进度状态）

## 资源文件

- `assets/data/amap_poi_categories.csv` - POI 分类（从 docs/ 复制）
- `assets/data/amap_city_codes.csv` - 城市编码（从 docs/ 复制）

### 图片资源（docs/）

- `logo.png` - 应用 Logo
- `menu-bottom.jpg` - 菜单底部图
- `image.jpg` - 关于项目底图
