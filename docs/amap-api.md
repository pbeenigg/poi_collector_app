# 高德地图 POI 搜索 API 2.0

> 官方文档：https://lbs.amap.com/api/webservice/guide/api-advanced/newpoisearch

## 产品概述

地点搜索服务 2.0 是一类 Web API 接口服务，提供多种场景的地点搜索能力：

- **关键字搜索** - 通过文本关键字搜索地点信息
- **周边搜索** - 设置圆心和半径，搜索圆形区域内的地点
- **多边形区域搜索** - 搜索多边形区域内的地点
- **ID 搜索** - 通过已知 POI ID 搜索地点信息

## **注意**：

- 翻页查询最多支持获取 **25 条**数据
- types 参数需要通过加载 [高德 POI 分类与编码.csv](高德POI分类与编码.csv) 文件来获取选择 （NEW_TYPE 字段）
- region 参数需要通过加载 [AMap_adcode_citycode.csv](AMap_adcode_citycode.csv) 文件来获取选择 （citycode，adcode，cityname；cityname 字段都行）
- key 参数需要通过高德地图 API Key 获取
- 参数 keyword 或者 types 二选一必填

---

## 1. 关键字搜索

### API 地址

```
GET https://restapi.amap.com/v5/place/text
```

### 请求参数

| 参数名        | 含义         | 规则说明                                                                   | 是否必须  | 缺省值  |
| ------------- | ------------ | -------------------------------------------------------------------------- | --------- | ------- |
| `key`         | 高德 Key     | 用户申请的 Web 服务 API 类型 Key                                           | ✅ 必填   | 无      |
| `keywords`    | 地点关键字   | 只支持一个关键字，总长度不超过 80 字符                                     | ⚠️ 二选一 | 无      |
| `types`       | 指定地点类型 | POI typecode，多个用 `\|` 分隔，参考 [POI 分类码表](高德POI分类与编码.csv) | ⚠️ 二选一 | 无      |
| `region`      | 搜索区划     | 可输入 citycode、adcode、cityname（如"北京市"）                            | 可选      | 全国    |
| `city_limit`  | 限制区域     | `true` 时仅召回 region 对应区域内数据                                      | 可选      | `false` |
| `show_fields` | 返回字段控制 | 多个字段用 `,` 分隔，见下方 show_fields 说明                               | 可选      | 空      |
| `page_size`   | 每页数据条数 | 取值 1-25                                                                  | 可选      | 10      |
| `page_num`    | 请求页码     | 从 1 开始                                                                  | 可选      | 1       |

### 请求示例

```url
curl --location --request GET 'https://restapi.amap.com/v5/place/text?key=d87806426ef460a525c695566f207ff4&keywords=KFC&types=141201&region=广州&page_size=20&page_num=1' \
--header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
--header 'Accept: */*' \
--header 'Host: restapi.amap.com' \
--header 'Connection: keep-alive'
```

---

## 2. 周边搜索

### API 地址

```
GET https://restapi.amap.com/v5/place/around
```

### 请求参数

| 参数名        | 含义         | 规则说明                                   | 是否必须 | 缺省值         |
| ------------- | ------------ | ------------------------------------------ | -------- | -------------- |
| `key`         | 高德 Key     | 用户申请的 Web 服务 API 类型 Key           | ✅ 必填  | 无             |
| `location`    | 中心点坐标   | 格式：`经度,纬度`，小数点后不超过 6 位     | ✅ 必填  | 无             |
| `radius`      | 搜索半径     | 取值 0-50000，单位：米                     | 可选     | 5000           |
| `keywords`    | 地点关键字   | 只支持一个关键字，总长度不超过 80 字符     | 可选     | 无             |
| `types`       | 指定地点类型 | POI typecode，多个用 `\|` 分隔             | 可选     | 餐饮/生活/商住 |
| `sortrule`    | 排序规则     | `distance`（按距离）/ `weight`（综合排序） | 可选     | `distance`     |
| `region`      | 搜索区划     | 可输入行政区划名或 citycode/adcode         | 可选     | 全国           |
| `city_limit`  | 限制区域     | `true` 时仅召回 region 对应区域内数据      | 可选     | `false`        |
| `show_fields` | 返回字段控制 | 多个字段用 `,` 分隔                        | 可选     | 空             |
| `page_size`   | 每页数据条数 | 取值 1-25                                  | 可选     | 10             |
| `page_num`    | 请求页码     | 从 1 开始                                  | 可选     | 1              |

### 请求示例

```url
https://restapi.amap.com/v5/place/around?location=116.473168,39.993015&radius=10000&types=011100&key=<用户的key>
```

---

## 3. 多边形区域搜索

### API 地址

```
GET https://restapi.amap.com/v5/place/polygon
```

### 请求参数

| 参数名        | 含义         | 规则说明                                                 | 是否必须 | 缺省值    |
| ------------- | ------------ | -------------------------------------------------------- | -------- | --------- |
| `key`         | 高德 Key     | 用户申请的 Web 服务 API 类型 Key                         | ✅ 必填  | 无        |
| `polygon`     | 多边形区域   | 坐标对用 `\|` 分隔，首尾坐标需相同；矩形可传左上右下两点 | ✅ 必填  | 无        |
| `keywords`    | 地点关键字   | 只支持一个关键字，总长度不超过 80 字符                   | 可选     | 无        |
| `types`       | 指定地点类型 | POI typecode，多个用 `\|` 分隔                           | 可选     | 商住/交通 |
| `show_fields` | 返回字段控制 | 多个字段用 `,` 分隔                                      | 可选     | 空        |
| `page_size`   | 每页数据条数 | 取值 1-25                                                | 可选     | 10        |
| `page_num`    | 请求页码     | 从 1 开始                                                | 可选     | 1         |

### 请求示例

```url
https://restapi.amap.com/v5/place/polygon?polygon=116.460988,40.006919|116.48231,40.007381|116.47516,39.99713|116.472596,39.985227|116.45669,39.984989|116.460988,40.006919&keywords=肯德基&types=050301&key=<用户的key>
```

---

## 4. ID 搜索

### API 地址

```
GET https://restapi.amap.com/v5/place/detail
```

### 请求参数

| 参数名        | 含义         | 规则说明                         | 是否必须 | 缺省值 |
| ------------- | ------------ | -------------------------------- | -------- | ------ |
| `key`         | 高德 Key     | 用户申请的 Web 服务 API 类型 Key | ✅ 必填  | 无     |
| `id`          | POI 唯一标识 | 最多 10 个，多个用 `\|` 分隔     | ✅ 必填  | 无     |
| `show_fields` | 返回字段控制 | 多个字段用 `,` 分隔              | 可选     | 空     |

### 请求示例

```url
https://restapi.amap.com/v5/place/detail?id=B000A7BM4H|B0FFKEPXS2&key=<用户的key>
```

---

## 返回结果

### 基础字段

| 字段名     | 类型   | 说明                                      |
| ---------- | ------ | ----------------------------------------- |
| `status`   | string | API 访问状态，成功返回 `1`，失败返回 `0`  |
| `info`     | string | 状态说明，成功返回 `ok`，失败返回错误原因 |
| `infocode` | string | 状态码，`10000` 代表正确                  |
| `count`    | string | 单次请求返回的 POI 数量                   |
| `pois`     | array  | POI 列表                                  |

### POI 基础信息

| 字段名     | 类型   | 说明                           |
| ---------- | ------ | ------------------------------ |
| `id`       | string | POI 唯一标识                   |
| `name`     | string | POI 名称                       |
| `location` | string | 经纬度，格式：`经度,纬度`      |
| `type`     | string | POI 所属类型                   |
| `typecode` | string | POI 分类编码                   |
| `address`  | string | 详细地址                       |
| `pname`    | string | 省份名称                       |
| `pcode`    | string | 省份编码                       |
| `cityname` | string | 城市名称                       |
| `citycode` | string | 城市编码                       |
| `adname`   | string | 区县名称                       |
| `adcode`   | string | 区域编码                       |
| `distance` | string | 离中心点距离（仅周边搜索返回） |

### show_fields 扩展字段

通过 `show_fields` 参数指定返回以下扩展信息：

#### children - 子 POI 信息

| 字段名     | 类型   | 说明            |
| ---------- | ------ | --------------- |
| `id`       | string | 子 POI 唯一标识 |
| `name`     | string | 子 POI 名称     |
| `location` | string | 子 POI 经纬度   |
| `address`  | string | 子 POI 详细地址 |
| `subtype`  | string | 子 POI 所属类型 |
| `typecode` | string | 子 POI 分类编码 |

#### business - 商业信息

| 字段名           | 类型   | 说明                              |
| ---------------- | ------ | --------------------------------- |
| `business_area`  | string | 所属商圈                          |
| `tel`            | string | 联系电话                          |
| `opentime_today` | string | 今日营业时间                      |
| `opentime_week`  | string | 营业时间描述                      |
| `rating`         | string | 评分（餐饮/酒店/景点/影院类）     |
| `cost`           | string | 人均消费（餐饮/酒店/景点/影院类） |
| `tag`            | string | 特色内容（美食类）                |
| `parking_type`   | string | 停车场类型（停车场类）            |
| `alias`          | string | 别名                              |

#### indoor - 室内信息

| 字段名       | 类型   | 说明                           |
| ------------ | ------ | ------------------------------ |
| `indoor_map` | string | 是否有室内地图，`1` 有，`0` 无 |
| `cpid`       | string | 建筑物 POI ID                  |
| `floor`      | string | 楼层索引（如 `8`）             |
| `truefloor`  | string | 所在楼层（如 `F8`）            |

#### navi - 导航信息

| 字段名          | 类型   | 说明           |
| --------------- | ------ | -------------- |
| `navi_poiid`    | string | 导航引导点坐标 |
| `entr_location` | string | 入口经纬度     |
| `exit_location` | string | 出口经纬度     |
| `gridcode`      | string | 地理格 ID      |

#### photos - 图片信息

| 字段名  | 类型   | 说明         |
| ------- | ------ | ------------ |
| `title` | string | 图片介绍     |
| `url`   | string | 图片下载链接 |

---

## 返回示例

```json
{
  "status": "1",
  "info": "OK",
  "infocode": "10000",
  "pois": [
    {
      "name": "体育西路(地铁站)",
      "id": "BV10014336",
      "location": "113.321503,23.131138",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "1号线;3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX09907479",
          "name": "体育西路地铁站G口",
          "sname": " G口 ",
          "location": "113.321184,23.130070",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907476",
          "name": "体育西路地铁站B口",
          "sname": " B口 ",
          "location": "113.322654,23.130817",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907473",
          "name": "体育西路地铁站A口",
          "sname": " A口 ",
          "location": "113.321204,23.131213",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907474",
          "name": "体育西路地铁站E口",
          "sname": " E口 ",
          "location": "113.321903,23.132073",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907475",
          "name": "体育西路地铁站C口",
          "sname": " C口 ",
          "location": "113.322626,23.131364",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907480",
          "name": "体育西路地铁站H口",
          "sname": " H口 ",
          "location": "113.321790,23.130648",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907477",
          "name": "体育西路地铁站D口",
          "sname": " D口 ",
          "location": "113.321864,23.131556",
          "address": "1号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907478",
          "name": "体育西路地铁站出入口",
          "sname": " 出入口 ",
          "location": "113.322735,23.131133",
          "address": "1号线;3号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "广州南站(地铁站)",
      "id": "BV10019725",
      "location": "113.269815,22.988773",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "22号线;2号线;7号线;佛山2号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "children": [
        {
          "id": "BX10036202",
          "name": "广州南站地铁站Q口",
          "sname": " Q口 ",
          "location": "113.272201,22.988401",
          "address": "22号线;2号线;7号线",
          "typecode": "150501"
        },
        {
          "id": "BX10034822",
          "name": "广州南站地铁站R口",
          "sname": " R口 ",
          "location": "113.266383,22.987355",
          "address": "佛山2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10034279",
          "name": "广州南站地铁站S口",
          "sname": " S口 ",
          "location": "113.266048,22.989066",
          "address": "佛山2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09916645",
          "name": "广州南站地铁站F口",
          "sname": " F口 ",
          "location": "113.269832,22.989076",
          "address": "22号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09916643",
          "name": "广州南站地铁站G入口",
          "sname": " G入口 ",
          "location": "113.270437,22.988643",
          "address": "7号线",
          "typecode": "150501"
        },
        {
          "id": "BX09916644",
          "name": "广州南站地铁站L口",
          "sname": " L口 ",
          "location": "113.267909,22.988677",
          "address": "22号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10036203",
          "name": "广州南站地铁站M口",
          "sname": " M口 ",
          "location": "113.272134,22.989664",
          "address": "22号线;2号线;7号线",
          "typecode": "150501"
        },
        {
          "id": "BX09916642",
          "name": "广州南站地铁站E入口",
          "sname": " E入口 ",
          "location": "113.269598,22.988136",
          "address": "7号线",
          "typecode": "150501"
        },
        {
          "id": "BX09916646",
          "name": "广州南站地铁站K入口",
          "sname": " K入口 ",
          "location": "113.268847,22.989228",
          "address": "7号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "嘉禾望岗(地铁站)",
      "id": "BV10024352",
      "location": "113.289243,23.237460",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "白云区",
      "address": "14号线;2号线;3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440111",
      "children": [
        {
          "id": "BX10017979",
          "name": "嘉禾望岗地铁站B口",
          "sname": " B口 ",
          "location": "113.289399,23.237603",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017978",
          "name": "嘉禾望岗地铁站A口",
          "sname": " A口 ",
          "location": "113.289401,23.237159",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026365",
          "name": "嘉禾望岗地铁站D口",
          "sname": " D口 ",
          "location": "113.288760,23.237547",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026368",
          "name": "嘉禾望岗地铁站G口",
          "sname": " G口 ",
          "location": "113.288633,23.236236",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026364",
          "name": "嘉禾望岗地铁站H口",
          "sname": " H口 ",
          "location": "113.288909,23.235960",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026366",
          "name": "嘉禾望岗地铁站C口",
          "sname": " C口 ",
          "location": "113.289007,23.237902",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026367",
          "name": "嘉禾望岗地铁站E口",
          "sname": " E口 ",
          "location": "113.288770,23.237061",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10026363",
          "name": "嘉禾望岗地铁站F口",
          "sname": " F口 ",
          "location": "113.289006,23.236978",
          "address": "14号线;2号线;3号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "嘉禾",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "番禺广场(地铁站)",
      "id": "BV10019880",
      "location": "113.385642,22.935482",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "18号线;22号线;3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "children": [
        {
          "id": "BX10017941",
          "name": "番禺广场地铁站C口",
          "sname": " C口 ",
          "location": "113.385943,22.936053",
          "address": "3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033928",
          "name": "番禺广场地铁站H口",
          "sname": " H口 ",
          "location": "113.383664,22.932069",
          "address": "18号线;22号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033927",
          "name": "番禺广场地铁站E口",
          "sname": " E口 ",
          "location": "113.385395,22.933030",
          "address": "18号线;22号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033926",
          "name": "番禺广场地铁站G1口",
          "sname": " G1口 ",
          "location": "113.383927,22.934984",
          "address": "18号线;22号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033925",
          "name": "番禺广场地铁站F口",
          "sname": " F口 ",
          "location": "113.385122,22.934223",
          "address": "18号线;22号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "市桥",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "珠江新城(地铁站)",
      "id": "BV10024361",
      "location": "113.321202,23.119366",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "3号线;5号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX10017903",
          "name": "珠江新城地铁站A1口",
          "sname": " A1口 ",
          "location": "113.320912,23.120160",
          "address": "3号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10009701",
          "name": "珠江新城地铁站D口",
          "sname": " D口 ",
          "location": "113.321818,23.119779",
          "address": "3号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017901",
          "name": "珠江新城地铁站A2口",
          "sname": " A2口 ",
          "location": "113.319955,23.119803",
          "address": "3号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10024812",
          "name": "珠江新城地铁站C口",
          "sname": " C口 ",
          "location": "113.321730,23.118826",
          "address": "3号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017902",
          "name": "珠江新城地铁站B1口",
          "sname": " B1口 ",
          "location": "113.320896,23.117931",
          "address": "3号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017900",
          "name": "珠江新城地铁站B2口",
          "sname": " B2口 ",
          "location": "113.320753,23.118767",
          "address": "3号线;5号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "三元里(地铁站)",
      "id": "BV10014446",
      "location": "113.256851,23.159402",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "白云区",
      "address": "2号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440111",
      "children": [
        {
          "id": "BX09907605",
          "name": "三元里地铁站A1口",
          "sname": " A1口 ",
          "location": "113.257363,23.157305",
          "address": "2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907606",
          "name": "三元里地铁站A2口",
          "sname": " A2口 ",
          "location": "113.257564,23.157956",
          "address": "2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907609",
          "name": "三元里地铁站C1口",
          "sname": " C1口 ",
          "location": "113.257165,23.160634",
          "address": "2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907607",
          "name": "三元里地铁站D口",
          "sname": " D口 ",
          "location": "113.255468,23.158493",
          "address": "2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907604",
          "name": "三元里地铁站C2口",
          "sname": " C2口 ",
          "location": "113.256581,23.160138",
          "address": "2号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907608",
          "name": "三元里地铁站B口",
          "sname": " B口 ",
          "location": "113.257758,23.159189",
          "address": "2号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "南村万博(地铁站)",
      "id": "BV10569459",
      "location": "113.347555,23.004789",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "18号线;7号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "children": [
        {
          "id": "BX10033930",
          "name": "南村万博地铁站D口",
          "sname": " D口 ",
          "location": "113.343236,23.005332",
          "address": "18号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033932",
          "name": "南村万博地铁站G口",
          "sname": " G口 ",
          "location": "113.344393,23.003717",
          "address": "18号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033929",
          "name": "南村万博地铁站E2口",
          "sname": " E2口 ",
          "location": "113.344619,23.001991",
          "address": "18号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033931",
          "name": "南村万博地铁站E1口",
          "sname": " E1口 ",
          "location": "113.343405,23.002704",
          "address": "18号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033933",
          "name": "南村万博地铁站C口",
          "sname": " C口 ",
          "location": "113.344980,23.003711",
          "address": "18号线",
          "typecode": "150501"
        },
        {
          "id": "BX09904292",
          "name": "南村万博地铁站B1口",
          "sname": " B1口 ",
          "location": "113.346651,23.004623",
          "address": "7号线",
          "typecode": "150501"
        },
        {
          "id": "BX10033638",
          "name": "南村万博地铁站出入口",
          "sname": " 出入口 ",
          "location": "113.348007,23.004343",
          "address": "7号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "市桥(地铁站)",
      "id": "BV10024358",
      "location": "113.361726,22.949743",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "business": {
        "business_area": "市桥",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "大石(地铁站)",
      "id": "BV10019878",
      "location": "113.321744,23.017761",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "children": [
        {
          "id": "BX10017937",
          "name": "大石地铁站A口",
          "sname": " A口 ",
          "location": "113.320847,23.018353",
          "address": "3号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "大石",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "车陂南(地铁站)",
      "id": "BV10014566",
      "location": "113.390007,23.115856",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "4号线;5号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX09907555",
          "name": "车陂南地铁站C口",
          "sname": " C口 ",
          "location": "113.390734,23.116181",
          "address": "4号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907553",
          "name": "车陂南地铁站B口",
          "sname": " B口 ",
          "location": "113.391072,23.115086",
          "address": "4号线;5号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907554",
          "name": "车陂南地铁站A口",
          "sname": " A口 ",
          "location": "113.388904,23.115648",
          "address": "4号线;5号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "大学城南(地铁站)",
      "id": "BV10024365",
      "location": "113.400478,23.043408",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "番禺区",
      "address": "12号线;4号线;7号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440113",
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "客村(地铁站)",
      "id": "BV10014653",
      "location": "113.320331,23.096197",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "海珠区",
      "address": "3号线;8号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440105",
      "business": {
        "business_area": "新港",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "黄村(地铁站)",
      "id": "BV10014561",
      "location": "113.407050,23.132086",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "21号线;4号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX09907567",
          "name": "黄村地铁站B口",
          "sname": " B口 ",
          "location": "113.406920,23.131444",
          "address": "21号线;4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907570",
          "name": "黄村地铁站D口",
          "sname": " D口 ",
          "location": "113.407761,23.132368",
          "address": "21号线;4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907566",
          "name": "黄村地铁站E口",
          "sname": " E口 ",
          "location": "113.407085,23.133111",
          "address": "21号线;4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907569",
          "name": "黄村地铁站F口",
          "sname": " F口 ",
          "location": "113.406693,23.133797",
          "address": "21号线;4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907571",
          "name": "黄村地铁站A口",
          "sname": " A口 ",
          "location": "113.406239,23.133343",
          "address": "21号线;4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907568",
          "name": "黄村地铁站H口",
          "sname": " H口 ",
          "location": "113.406043,23.134332",
          "address": "21号线;4号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "东圃",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "公园前(地铁站)",
      "id": "BV10016207",
      "location": "113.264183,23.125419",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "越秀区",
      "address": "1号线;2号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440104",
      "children": [
        {
          "id": "BX10017691",
          "name": "公园前地铁站A口",
          "sname": " A口 ",
          "location": "113.263406,23.125215",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017692",
          "name": "公园前地铁站D口",
          "sname": " D口 ",
          "location": "113.265398,23.124983",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10019789",
          "name": "公园前地铁站E口",
          "sname": " E口 ",
          "location": "113.265371,23.125504",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017694",
          "name": "公园前地铁站J口",
          "sname": " J口 ",
          "location": "113.264383,23.124596",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017690",
          "name": "公园前地铁站I2口",
          "sname": " I2口 ",
          "location": "113.262994,23.125585",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10036060",
          "name": "公园前地铁站出入口",
          "sname": " 出入口 ",
          "location": "113.267263,23.125401",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017685",
          "name": "公园前地铁站F口",
          "sname": " F口 ",
          "location": "113.264901,23.125714",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017687",
          "name": "公园前地铁站C口",
          "sname": " C口 ",
          "location": "113.264668,23.125244",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10036058",
          "name": "公园前地铁站G口",
          "sname": " G口 ",
          "location": "113.264465,23.125606",
          "address": "1号线;2号线",
          "typecode": "150501"
        },
        {
          "id": "BX10036055",
          "name": "公园前地铁站B1口",
          "sname": " B1口 ",
          "location": "113.263857,23.125241",
          "address": "1号线;2号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "建设",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "万胜围(地铁站)",
      "id": "BV10024362",
      "location": "113.384560,23.097759",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "海珠区",
      "address": "(在建)8号线东延段;4号线;8号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440105",
      "children": [
        {
          "id": "BX09907536",
          "name": "万胜围地铁站B口",
          "sname": " B口 ",
          "location": "113.385483,23.097056",
          "address": "4号线;8号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907534",
          "name": "万胜围地铁站A口",
          "sname": " A口 ",
          "location": "113.383886,23.097192",
          "address": "4号线;8号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907535",
          "name": "万胜围地铁站D口",
          "sname": " D口 ",
          "location": "113.384561,23.098618",
          "address": "4号线;8号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907533",
          "name": "万胜围地铁站C口",
          "sname": " C口 ",
          "location": "113.385916,23.098141",
          "address": "4号线;8号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907537",
          "name": "万胜围地铁站出入口",
          "sname": " 出入口 ",
          "location": "113.384023,23.098562",
          "address": "4号线;8号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "琶洲",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "天河客运站(地铁站)",
      "id": "BV10014278",
      "location": "113.343986,23.171175",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "3号线;6号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX10021608",
          "name": "天河客运站地铁站C口",
          "sname": " C口 ",
          "location": "113.345365,23.170562",
          "address": "3号线;6号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017848",
          "name": "天河客运站地铁站D口",
          "sname": " D口 ",
          "location": "113.343722,23.171166",
          "address": "3号线;6号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017847",
          "name": "天河客运站地铁站B口",
          "sname": " B口 ",
          "location": "113.342817,23.170497",
          "address": "3号线;6号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017849",
          "name": "天河客运站地铁站A口",
          "sname": " A口 ",
          "location": "113.344437,23.171228",
          "address": "3号线;6号线",
          "typecode": "150501"
        },
        {
          "id": "BX10032913",
          "name": "天河客运站地铁站出入口",
          "sname": " 出入口 ",
          "location": "113.343640,23.171476",
          "address": "3号线;6号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "燕岭",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "滘口(地铁站)",
      "id": "BV10024372",
      "location": "113.208440,23.113796",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "荔湾区",
      "address": "5号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440103",
      "children": [
        {
          "id": "BX10017972",
          "name": "滘口地铁站A1口",
          "sname": " A1口 ",
          "location": "113.208367,23.113349",
          "address": "5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017975",
          "name": "滘口地铁站B2口",
          "sname": " B2口 ",
          "location": "113.209333,23.114798",
          "address": "5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017973",
          "name": "滘口地铁站A2口",
          "sname": " A2口 ",
          "location": "113.208094,23.112520",
          "address": "5号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017974",
          "name": "滘口地铁站B1口",
          "sname": " B1口 ",
          "location": "113.208814,23.114093",
          "address": "5号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "车陂(地铁站)",
      "id": "BV10014611",
      "location": "113.396489,23.124704",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "天河区",
      "address": "13号线;4号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440106",
      "children": [
        {
          "id": "BX09907597",
          "name": "车陂地铁站D口",
          "sname": " D口 ",
          "location": "113.396153,23.124150",
          "address": "4号线",
          "typecode": "150501"
        },
        {
          "id": "BX09907598",
          "name": "车陂地铁站C口",
          "sname": " C口 ",
          "location": "113.394995,23.124011",
          "address": "4号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "车陂",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "新塘(地铁站)",
      "id": "BV10827185",
      "location": "113.604472,23.131731",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "增城区",
      "address": "13号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440118",
      "children": [
        {
          "id": "BX10024396",
          "name": "新塘地铁站D2口",
          "sname": " D2口 ",
          "location": "113.604832,23.130906",
          "address": "13号线",
          "typecode": "150501"
        },
        {
          "id": "BX10024665",
          "name": "新塘地铁站C口",
          "sname": " C口 ",
          "location": "113.604418,23.131512",
          "address": "13号线",
          "typecode": "150501"
        },
        {
          "id": "BX10024397",
          "name": "新塘地铁站E2口",
          "sname": " E2口 ",
          "location": "113.604175,23.131918",
          "address": "13号线",
          "typecode": "150501"
        },
        {
          "id": "BX09904092",
          "name": "新塘地铁站E1口",
          "sname": " E1口 ",
          "location": "113.605031,23.132045",
          "address": "13号线",
          "typecode": "150501"
        },
        {
          "id": "BX09904091",
          "name": "新塘地铁站E3口",
          "sname": " E3口 ",
          "location": "113.604547,23.132319",
          "address": "13号线",
          "typecode": "150501"
        },
        {
          "id": "BX09904090",
          "name": "新塘地铁站E4口",
          "sname": " E4口 ",
          "location": "113.604926,23.132374",
          "address": "13号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "新塘",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    },
    {
      "name": "永泰(地铁站)",
      "id": "BV10024354",
      "location": "113.306235,23.219881",
      "type": "交通设施服务;地铁站;地铁站",
      "typecode": "150500",
      "pname": "广东省",
      "cityname": "广州市",
      "adname": "白云区",
      "address": "3号线",
      "pcode": "440000",
      "citycode": "020",
      "adcode": "440111",
      "children": [
        {
          "id": "BX10017910",
          "name": "永泰地铁站B2口",
          "sname": " B2口 ",
          "location": "113.306156,23.220610",
          "address": "3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017909",
          "name": "永泰地铁站A口",
          "sname": " A口 ",
          "location": "113.306111,23.219765",
          "address": "3号线",
          "typecode": "150501"
        },
        {
          "id": "BX10017911",
          "name": "永泰地铁站B1口",
          "sname": " B1口 ",
          "location": "113.306594,23.219957",
          "address": "3号线",
          "typecode": "150501"
        }
      ],
      "business": {
        "business_area": "白云大道",
        "rectag": "地铁站",
        "keytag": "地铁站"
      },
      "distance": "",
      "parent": ""
    }
  ],
  "count": "20"
}
```

---

## 相关资源

- [POI 分类码表](高德POI分类与编码.csv) - `types` 参数值
- [城市编码表](AMap_adcode_citycode.csv) - `region` 参数值
- [错误码说明](https://lbs.amap.com/api/webservice/guide/tools/info)
