-- ============================================
-- POI 数据采集器 - Supabase 数据库重建脚本
-- ============================================
-- 使用说明：
-- 1. 登录 Supabase 控制台
-- 2. 进入 SQL Editor
-- 3. 复制并执行此脚本（会删除旧表并重建）
-- ============================================

-- 第一步：删除所有旧表
DROP TABLE IF EXISTS pois CASCADE;
DROP TABLE IF EXISTS city_codes CASCADE;
DROP TABLE IF EXISTS poi_type_codes CASCADE;
DROP TABLE IF EXISTS global_settings CASCADE;

-- 第二步：重建所有表

-- 1. POI 数据表
CREATE TABLE pois (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  type_code TEXT,
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
  business_area TEXT,
  website TEXT,
  email TEXT,
  postcode TEXT,
  photos TEXT,
  indoor_map TEXT,
  indoor_data TEXT,
  gridcode TEXT,
  shopinfo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_pois_name ON pois(name);
CREATE INDEX idx_pois_type ON pois(type);
CREATE INDEX idx_pois_cityname ON pois(cityname);
CREATE INDEX idx_pois_adcode ON pois(adcode);
CREATE INDEX idx_pois_type_code ON pois(type_code);

-- 2. 城市编码表
CREATE TABLE city_codes (
  adcode TEXT PRIMARY KEY,
  citycode TEXT,
  name TEXT NOT NULL,
  center TEXT,
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_city_codes_name ON city_codes(name);
CREATE INDEX idx_city_codes_citycode ON city_codes(citycode);

-- 3. POI 分类编码表
CREATE TABLE poi_type_codes (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_code TEXT,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_poi_type_codes_name ON poi_type_codes(name);
CREATE INDEX idx_poi_type_codes_parent ON poi_type_codes(parent_code);
CREATE INDEX idx_poi_type_codes_level ON poi_type_codes(level);

-- 4. 全局设置表
CREATE TABLE global_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 第三步：启用 Row Level Security (RLS)
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi_type_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- 第四步：创建允许所有操作的策略（开发环境使用）
-- 注意：生产环境请根据需求调整权限策略

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "允许所有操作 pois" ON pois;
DROP POLICY IF EXISTS "允许所有操作 city_codes" ON city_codes;
DROP POLICY IF EXISTS "允许所有操作 poi_type_codes" ON poi_type_codes;
DROP POLICY IF EXISTS "允许所有操作 global_settings" ON global_settings;

-- 创建新策略
CREATE POLICY "允许所有操作 pois" ON pois FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "允许所有操作 city_codes" ON city_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "允许所有操作 poi_type_codes" ON poi_type_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "允许所有操作 global_settings" ON global_settings FOR ALL USING (true) WITH CHECK (true);

-- 第五步：创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS update_pois_updated_at ON pois;
DROP TRIGGER IF EXISTS update_city_codes_updated_at ON city_codes;
DROP TRIGGER IF EXISTS update_poi_type_codes_updated_at ON poi_type_codes;
DROP TRIGGER IF EXISTS update_global_settings_updated_at ON global_settings;

-- 创建新触发器
CREATE TRIGGER update_pois_updated_at BEFORE UPDATE ON pois
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_city_codes_updated_at BEFORE UPDATE ON city_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poi_type_codes_updated_at BEFORE UPDATE ON poi_type_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成！
-- ============================================
-- 表结构已重建完成，现在可以在应用中导入数据了
