/**
 * POI 数据模型
 */
export interface POI {
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
  adcode: string;       // 行政区划编码
  citycode: string;     // 城市编码
  parent?: string;      // 父级 POI
  distance?: string;    // 距离
  createdAt?: number;   // 创建时间戳
  updatedAt?: number;   // 更新时间戳
}

/**
 * POI 分类
 */
export interface POICategory {
  code: string;         // 分类编码
  name: string;         // 分类名称
  parentCode?: string;  // 父级分类编码
}

/**
 * 城市编码
 */
export interface CityCode {
  adcode: string;       // 行政区划编码
  citycode: string;     // 城市编码
  name: string;         // 城市名称
  center: string;       // 中心坐标
  level: string;        // 行政级别
}

/**
 * 搜索模式
 */
export type SearchMode = 'text' | 'around';

/**
 * POI 搜索参数（关键字搜索）
 */
export interface SearchParams {
  keywords?: string;    // 关键词
  types?: string;       // POI 类型编码
  region?: string;      // 区域编码
  city_limit?: boolean; // 是否限制城市
  page_num?: number;    // 页码
  page_size?: number;   // 每页数量
  extensions?: string;  // 返回结果详细程度
}

/**
 * 周边搜索参数
 */
export interface AroundSearchParams {
  location: string;     // 中心点坐标 "经度,纬度"
  radius?: number;      // 搜索半径（米），0-50000
  keywords?: string;    // 关键词
  types?: string;       // POI 类型编码
  sortrule?: 'distance' | 'weight'; // 排序规则
  region?: string;      // 区域编码
  city_limit?: boolean; // 是否限制城市
  page_num?: number;    // 页码
  page_size?: number;   // 每页数量
  extensions?: string;  // 返回结果详细程度
}

/**
 * 高德 API 响应
 */
export interface AmapResponse {
  status: string;       // 状态码 "1" 表示成功
  count: string;        // 返回结果数量
  info: string;         // 返回状态说明
  infocode: string;     // 返回状态码
  pois: POI[];          // POI 数据数组
}

/**
 * 批量采集参数
 */
export interface BatchCollectParams {
  types: string[];      // POI 类型编码数组
  regions: string[];    // 区域编码数组
  pageSize: number;     // 每页数量
  maxPages?: number;    // 最大页数
  delay?: number;       // 请求延迟（毫秒）
}

/**
 * 批量采集进度
 */
export interface BatchProgress {
  total: number;        // 总任务数
  completed: number;    // 已完成数
  failed: number;       // 失败数
  current: string;      // 当前任务描述
  percentage: number;   // 完成百分比
  isRunning: boolean;   // 是否正在运行
}
