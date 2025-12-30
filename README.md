# 高德 POI 数据采集应用

## 项目概述

这是一个使用 Flutter 构建的原生 macOS 桌面应用程序，用于从高德开放平台采集 POI（兴趣点）数据。应用支持关键词搜索、本地数据库存储以及 CSV 格式导出功能。

## 功能特性

### 核心功能

| 功能模块        | 描述                                                       |
| --------------- | ---------------------------------------------------------- |
| 🔍 **POI 搜索** | 通过关键字、城市、POI 类型查询高德地图 API                 |
| 💾 **本地存储** | 将感兴趣的 POI 数据保存到本地 SQLite,MySQL,Postgres 数据库 |
| 📤 **数据导出** | 将保存的数据导出为 CSV 格式（兼容 Excel）                  |
| ⚙️ **设置管理** | 配置高德 API Key 及应用偏好设置                            |
| 📑 **分页加载** | 支持分页查询和加载更多结果                                 |

| 🔍 **批量采集** | 支持按指定筛选条件批量自动分页采集，并需要兼容断点续采 ｜

### 资源列表

logo: ![alt text](docs/logo.png)
菜单底部图：![alt text](docs/menu-bottom.jpg)
关于项目底图：![alt text](docs/image.jpg)

高德 POI 分类与编码： [text](docs/amap_poi_typecode.csv)
高德城市编码：[text](docs/amap_adcode_citycode.csv)
高德 API: [text](docs/amap-api.md)

### 数据模型

#### POI（兴趣点）

```dart
class POI {
  final String id;           // POI 唯一标识
  final String name;         // 名称
  final String type;         // 类型名称
  final String typeCode;     // 类型编码
  final String address;      // 地址
  final String location;     // 坐标 "经度,纬度"
  final String? tel;         // 电话
  final String pcode;        // 省份编码
  final String pname;        // 省份名称
  final String cityname;     // 城市名称
  final String adname;       // 区域名称
  final String adcode;       // 区域编码
  final String citycode;     // 城市编码
  final String? parent;      // 父级 POI
  final String? distance;    // 距离
}
```

#### POI 类别

```dart
class POICategory {
  final String id;
  final String code;         // 类别编码
  final String large;        // 大类
  final String medium;       // 中类
  final String small;        // 小类
  final String bigCategory;  // 大类(英文)
  final String midCategory;  // 中类(英文)
  final String subCategory;  // 小类(英文)
}
```

#### 城市编码

```dart
class CityCode {
  final String adcode;       // 行政区划编码
  final String name;         // 城市名称
  final String citycode;     // 城市编码
}
```

## 项目结构

```
poi_collector_app/
├── lib/
│   ├── main.dart                    # 应用入口
│   ├── app.dart                     # 应用配置
│   │
│   ├── models/                      # 数据模型层
│   │   ├── poi.dart                 # POI 数据模型
│   │   ├── poi_category.dart        # POI 类别模型
│   │   └── city_code.dart           # 城市编码模型
│   │
│   ├── services/                    # 服务层
│   │   ├── amap_client.dart         # 高德 API 客户端
│   │   └── api_error.dart           # API 错误定义
│   │
│   ├── data/                        # 数据访问层
│   │   ├── db_manager.dart          # SQLite 数据库管理
│   │   └── database_exporter.dart   # 数据库导出功能
│   │
│   ├── utils/                       # 工具类
│   │   ├── csv_generator.dart       # CSV 生成器
│   │   └── csv_loader.dart          # CSV 加载器
│   │
│   ├── viewmodels/                  # 视图模型层 (状态管理)
│   │   └── search_viewmodel.dart    # 搜索业务逻辑
│   │
│   └── views/                       # 视图层
│       ├── content_view.dart        # 主内容视图
│       ├── sidebar_view.dart        # 侧边栏导航
│       ├── search_view.dart         # 搜索页面
│       ├── results_view.dart        # 搜索结果展示
│       ├── saved_pois_view.dart     # 已保存数据页面
│       ├── settings_view.dart       # 设置页面
│       └── widgets/
│           └── searchable_dropdown.dart  # 可搜索下拉组件
│
├── assets/                          # 资源文件
│   └── data/
│       ├── amap_poi_categories.csv  # POI 分类数据
│       └── amap_city_codes.csv      # 城市编码数据
│
├── macos/                           # macOS 平台配置
│   ├── Runner/
│   │   ├── Info.plist
│   │   └── MainFlutterWindow.swift
│   └── Runner.xcodeproj/
│
├── pubspec.yaml                     # Flutter 项目配置
└── README.md
```

## 技术架构

### 技术栈

| 层级         | 技术选型                             |
| ------------ | ------------------------------------ |
| **UI 框架**  | Flutter 3.x                          |
| **状态管理** | Provider / Riverpod                  |
| **数据库**   | sqflite + sqflite_common_ffi (macOS) |
| **网络请求** | dio / http                           |
| **架构模式** | MVVM                                 |
| **本地存储** | shared_preferences                   |

### 核心依赖

```yaml
dependencies:
  flutter:
    sdk: flutter

  # macOS 桌面支持
  macos_ui: ^2.0.0 # macOS 原生风格 UI 组件

  # 状态管理
  provider: ^6.1.0
  # 或使用 riverpod: ^2.4.0

  # 数据库
  sqflite_common_ffi: ^2.3.0 # macOS SQLite 支持
  path_provider: ^2.1.0 # 获取文件路径
  path: ^1.8.0

  # 网络请求
  dio: ^5.4.0

  # 文件操作
  file_picker: ^6.1.0 # 文件选择对话框
  csv: ^5.1.0 # CSV 处理

  # 本地存储
  shared_preferences: ^2.2.0 # 键值存储 (API Key 等)

  # 工具类
  intl: ^0.18.0 # 国际化和日期格式化
```

## 开发环境配置

### 前置要求

- Flutter SDK 3.16.0 或更高版本
- Dart SDK 3.2.0 或更高版本
- Xcode 15.0 或更高版本（用于 macOS 构建）
- macOS 12.0 或更高版本

### 安装步骤

1. **安装 Flutter SDK**

   ```bash
   # 使用 Homebrew
   brew install flutter

   # 或手动下载
   # https://docs.flutter.dev/get-started/install/macos
   ```

2. **启用 macOS 桌面支持**

   ```bash
   flutter config --enable-macos-desktop
   ```

3. **克隆项目并安装依赖**

   ```bash
   cd poi_collector_app
   flutter pub get
   ```

4. **运行应用**
   ```bash
   flutter run -d macos
   ```

### 开发调试

```bash
# 热重载运行
flutter run -d macos

# 调试模式（使用 VS Code 或 Android Studio）
# 设置断点，查看变量

# 生成发布版本
flutter build macos --release
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

### 高德 API 客户端

```dart
// lib/services/amap_client.dart
import 'package:dio/dio.dart';

class AmapClient {
  static final AmapClient _instance = AmapClient._internal();
  factory AmapClient() => _instance;
  AmapClient._internal();

  final Dio _dio = Dio();
  String _apiKey = '';

  static const String _baseUrl = 'https://restapi.amap.com/v5/place/text';

  void setApiKey(String key) => _apiKey = key;

  Future<List<POI>> searchPOI({
    String keywords = '',
    String region = '',
    String types = '',
    int pageSize = 20,
    int pageNum = 1,
  }) async {
    if (_apiKey.isEmpty) {
      throw AmapError.missingApiKey;
    }

    if (keywords.isEmpty && types.isEmpty) {
      throw AmapError.emptyParameters;
    }

    final response = await _dio.get(
      _baseUrl,
      queryParameters: {
        'key': _apiKey,
        if (keywords.isNotEmpty) 'keywords': keywords,
        if (region.isNotEmpty) 'region': region,
        if (types.isNotEmpty) 'types': types,
        'page_size': pageSize,
        'page_num': pageNum,
      },
    );

    final data = response.data;
    if (data['status'] == '1') {
      final pois = (data['pois'] as List?) ?? [];
      return pois.map((e) => POI.fromJson(e)).toList();
    } else {
      throw AmapError.apiError(data['info'] ?? '未知错误');
    }
  }
}
```

### 数据库管理器

```dart
// lib/data/db_manager.dart
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

class DBManager {
  static final DBManager _instance = DBManager._internal();
  factory DBManager() => _instance;
  DBManager._internal();

  Database? _database;

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    // macOS 需要初始化 FFI
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;

    final documentsDir = await getApplicationDocumentsDirectory();
    final path = join(documentsDir.path, 'POIDatabase.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createTables,
    );
  }

  Future<void> _createTables(Database db, int version) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS POI(
        id TEXT PRIMARY KEY,
        name TEXT,
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
        distance TEXT
      )
    ''');
  }

  Future<void> insertPOI(POI poi) async {
    final db = await database;
    await db.insert(
      'POI',
      poi.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<POI>> getAllPOIs() async {
    final db = await database;
    final maps = await db.query('POI');
    return maps.map((e) => POI.fromMap(e)).toList();
  }

  Future<void> deletePOI(String id) async {
    final db = await database;
    await db.delete('POI', where: 'id = ?', whereArgs: [id]);
  }
}
```

### 搜索视图模型

```dart
// lib/viewmodels/search_viewmodel.dart
import 'package:flutter/foundation.dart';

class SearchViewModel extends ChangeNotifier {
  String keywords = '';
  String region = '';
  String types = '';
  List<POI> searchResults = [];
  bool isLoading = false;
  String? errorMessage;
  String? successMessage;
  int currentPage = 1;
  bool hasMorePages = false;
  int pageSize = 10;

  final AmapClient _client = AmapClient();
  final DBManager _dbManager = DBManager();

  Future<void> search({bool loadMore = false}) async {
    if (keywords.isEmpty && types.isEmpty) {
      errorMessage = '请输入关键词或选择 POI 类型';
      notifyListeners();
      return;
    }

    isLoading = true;
    errorMessage = null;
    successMessage = null;

    if (!loadMore) {
      searchResults = [];
      currentPage = 1;
    }
    notifyListeners();

    try {
      final pois = await _client.searchPOI(
        keywords: keywords,
        region: region,
        types: types,
        pageSize: pageSize,
        pageNum: currentPage,
      );

      if (loadMore) {
        searchResults.addAll(pois);
      } else {
        searchResults = pois;
      }

      hasMorePages = pois.length == pageSize;
      successMessage = pois.isNotEmpty
          ? '找到 ${pois.length} 条结果'
          : null;
      errorMessage = pois.isEmpty ? '未找到匹配的 POI' : null;
    } catch (e) {
      errorMessage = e.toString();
    }

    isLoading = false;
    notifyListeners();
  }

  Future<void> loadMore() async {
    if (!hasMorePages || isLoading) return;
    currentPage++;
    await search(loadMore: true);
  }

  Future<void> savePOI(POI poi) async {
    await _dbManager.insertPOI(poi);
    successMessage = '已保存: ${poi.name}';
    notifyListeners();

    await Future.delayed(const Duration(seconds: 3));
    successMessage = null;
    notifyListeners();
  }

  Future<void> saveAllResults() async {
    for (final poi in searchResults) {
      await _dbManager.insertPOI(poi);
    }
    successMessage = '已保存 ${searchResults.length} 条 POI 数据';
    notifyListeners();
  }
}
```

## macOS 平台配置

### 网络权限

在 `macos/Runner/DebugProfile.entitlements` 和 `macos/Runner/Release.entitlements` 中添加：

```xml
<key>com.apple.security.network.client</key>
<true/>
```

### 文件访问权限

```xml
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
<key>com.apple.security.files.downloads.read-write</key>
<true/>
```

### 应用信息

在 `macos/Runner/Info.plist` 中配置：

```xml
<key>CFBundleName</key>
<string>POI Collector</string>
<key>CFBundleDisplayName</key>
<string>POI 数据采集</string>
<key>CFBundleIdentifier</key>
<string>com.yourcompany.poicollector</string>
<key>CFBundleVersion</key>
<string>1.0.0</string>
<key>LSMinimumSystemVersion</key>
<string>12.0</string>
```

## 构建与发布

### 开发版本

```bash
flutter run -d macos
```

### 发布版本

```bash
# 构建 Release 版本
flutter build macos --release

# 构建产物位置
# build/macos/Build/Products/Release/POI Collector.app
```

### 创建 DMG 安装包

```bash
# 使用 create-dmg 工具
brew install create-dmg

create-dmg \
  --volname "POI Collector" \
  --window-size 600 400 \
  --icon-size 100 \
  --app-drop-link 400 150 \
  "POI_Collector.dmg" \
  "build/macos/Build/Products/Release/POI Collector.app"
```

## 参考资料

- [Flutter macOS 桌面开发文档](https://docs.flutter.dev/desktop)
- [高德开放平台 POI 搜索 API](https://lbs.amap.com/api/webservice/guide/api/search)
- [sqflite_common_ffi 文档](https://pub.dev/packages/sqflite_common_ffi)
- [macos_ui 组件库](https://pub.dev/packages/macos_ui)

## 许可证

MIT License
