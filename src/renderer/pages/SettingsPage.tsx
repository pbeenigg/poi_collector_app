import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Switch,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Refresh,
} from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchSettings, saveSettings, ThemeMode } from '../store/settingsSlice';
import { themeNames } from '../theme/themes';

interface ApiKeyConfig {
  key: string;
  name: string;
  dailyLimit: number;
  usedToday: number;
  enabled: boolean;
  lastUsed?: number;
}

/**
 * 设置页面
 */
const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.settings);
  
  // API Keys 状态
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [apiKeyStats, setApiKeyStats] = useState<any[]>([]);
  
  // 全局设置状态
  const [pageSize, setPageSize] = useState(20);
  const [appTheme, setAppTheme] = useState<ThemeMode>('cyberpunk');
  const [autoSave, setAutoSave] = useState(false);
  const [searchDelay, setSearchDelay] = useState(200);
  
  // 对话框状态
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // 新增/编辑 API Key 表单
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    dailyLimit: 10000,
    enabled: true,
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // 数据统计状态
  const [dataStats, setDataStats] = useState({
    cityCodeCount: 0,
    poiTypeCodeCount: 0,
  });
  const [importing, setImporting] = useState(false);

  // Supabase 配置状态
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    key: '',
    enabled: false,
  });
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [databaseMode, setDatabaseMode] = useState<'local' | 'supabase'>('local');

  useEffect(() => {
    loadSettings();
    loadApiKeys();
    loadDataStats();
    loadSupabaseConfig();
    loadDatabaseMode();
  }, []);

  /**
   * 加载设置
   */
  const loadSettings = async () => {
    try {
      const response = await window.electronAPI.getSettings();
      if (response.success) {
        const settings = response.data;
        setPageSize(settings.pageSize || 20);
        setAppTheme(settings.theme || 'cyberpunk');
        setAutoSave(settings.autoSave || false);
        setSearchDelay(settings.searchDelay || 200);
      }
    } catch (error) {
      console.error('加载设置失败', error);
    }
  };

  /**
   * 加载 API Keys
   */
  const loadApiKeys = async () => {
    try {
      const response = await window.electronAPI.getAllApiKeys();
      if (response.success) {
        setApiKeys(response.data || []);
      }
      
      const statsResponse = await window.electronAPI.getApiKeyStats();
      if (statsResponse.success) {
        setApiKeyStats(statsResponse.data || []);
      }
    } catch (error) {
      console.error('加载 API Keys 失败', error);
    }
  };

  /**
   * 加载 Supabase 配置
   */
  const loadSupabaseConfig = async () => {
    try {
      const response = await window.electronAPI.getSupabaseConfig();
      if (response.success) {
        setSupabaseConfig(response.data || { url: '', key: '', enabled: false });
      }
    } catch (error) {
      console.error('加载 Supabase 配置失败', error);
    }
  };

  /**
   * 加载数据库模式
   */
  const loadDatabaseMode = async () => {
    try {
      const response = await window.electronAPI.getDatabaseMode();
      if (response.success) {
        setDatabaseMode(response.mode || 'local');
      }
    } catch (error) {
      console.error('加载数据库模式失败', error);
    }
  };

  /**
   * 保存 Supabase 配置
   */
  const handleSaveSupabaseConfig = async () => {
    try {
      const response = await window.electronAPI.saveSupabaseConfig(supabaseConfig);
      if (response.success) {
        alert('Supabase 配置已保存');
        loadDatabaseMode();
      } else {
        alert(`保存失败: ${response.error}`);
      }
    } catch (error) {
      alert(`保存失败: ${error}`);
    }
  };

  /**
   * 测试 Supabase 连接
   */
  const handleTestSupabaseConnection = async () => {
    if (!supabaseConfig.url || !supabaseConfig.key) {
      alert('请先填写 Supabase URL 和 API Key');
      return;
    }

    setSupabaseTesting(true);
    setSupabaseTestResult(null);

    try {
      const response = await window.electronAPI.testSupabaseConnection(
        supabaseConfig.url,
        supabaseConfig.key
      );

      if (response.success && response.connected) {
        setSupabaseTestResult({ 
          success: true, 
          message: response.message || '连接成功！' 
        });
      } else {
        setSupabaseTestResult({ 
          success: false, 
          message: response.message || response.error || '连接失败，请检查配置' 
        });
      }
    } catch (error) {
      setSupabaseTestResult({ 
        success: false, 
        message: `连接测试失败: ${error}` 
      });
    } finally {
      setSupabaseTesting(false);
    }
  };

  /**
   * 保存全局设置
   */
  const handleSaveSettings = async () => {
    try {
      const response = await window.electronAPI.setSettings({
        pageSize,
        theme: appTheme,
        autoSave,
        searchDelay,
      });
      
      if (response.success) {
        // 同时更新 Redux store
        dispatch(saveSettings({ theme: appTheme }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      alert(`保存失败: ${error}`);
    }
  };

  /**
   * 打开添加对话框
   */
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      key: '',
      dailyLimit: 10000,
      enabled: true,
    });
    setEditingIndex(null);
    setOpenAddDialog(true);
  };

  /**
   * 打开编辑对话框
   */
  const handleOpenEditDialog = (index: number) => {
    const apiKey = apiKeys[index];
    setFormData({
      name: apiKey.name,
      key: apiKey.key,
      dailyLimit: apiKey.dailyLimit,
      enabled: apiKey.enabled,
    });
    setEditingIndex(index);
    setOpenAddDialog(true);
  };

  /**
   * 保存 API Key
   */
  const handleSaveApiKey = async () => {
    if (!formData.name.trim() || !formData.key.trim()) {
      alert('请填写名称和 API Key');
      return;
    }

    try {
      if (editingIndex !== null) {
        // 更新
        await window.electronAPI.updateApiKey(editingIndex, formData);
      } else {
        // 添加
        await window.electronAPI.addApiKey(formData);
      }
      
      setOpenAddDialog(false);
      loadApiKeys();
    } catch (error) {
      alert(`操作失败: ${error}`);
    }
  };

  /**
   * 删除 API Key
   */
  const handleDeleteApiKey = async (index: number) => {
    if (!confirm('确定要删除这个 API Key 吗？')) return;
    
    try {
      await window.electronAPI.deleteApiKey(index);
      loadApiKeys();
    } catch (error) {
      alert(`删除失败: ${error}`);
    }
  };

  /**
   * 切换 API Key 启用状态
   */
  const handleToggleApiKey = async (index: number) => {
    try {
      const apiKey = apiKeys[index];
      await window.electronAPI.updateApiKey(index, {
        enabled: !apiKey.enabled,
      });
      loadApiKeys();
    } catch (error) {
      alert(`操作失败: ${error}`);
    }
  };

  /**
   * 加载数据统计
   */
  const loadDataStats = async () => {
    try {
      const response = await window.electronAPI.getDataStats();
      if (response.success) {
        setDataStats(response.data);
      }
    } catch (error) {
      console.error('加载数据统计失败', error);
    }
  };

  /**
   * 导入城市编码
   */
  const handleImportCityCodes = async () => {
    try {
      setImporting(true);
      
      // 选择文件
      const fileResponse = await window.electronAPI.selectCsvFile();
      if (!fileResponse.success || fileResponse.canceled) {
        setImporting(false);
        return;
      }

      // 导入文件
      const importResponse = await window.electronAPI.importCityCodes(fileResponse.filePath);
      
      if (importResponse.success) {
        alert(`导入成功！共导入 ${importResponse.count} 条城市编码数据`);
        loadDataStats();
      } else {
        alert(`导入失败: ${importResponse.error}`);
      }
    } catch (error) {
      alert(`导入失败: ${error}`);
    } finally {
      setImporting(false);
    }
  };

  /**
   * 导入 POI 分类编码
   */
  const handleImportPoiTypeCodes = async () => {
    try {
      setImporting(true);
      
      // 选择文件
      const fileResponse = await window.electronAPI.selectCsvFile();
      if (!fileResponse.success || fileResponse.canceled) {
        setImporting(false);
        return;
      }

      // 导入文件
      const importResponse = await window.electronAPI.importPoiTypeCodes(fileResponse.filePath);
      
      if (importResponse.success) {
        alert(`导入成功！共导入 ${importResponse.count} 条 POI 分类编码数据`);
        loadDataStats();
      } else {
        alert(`导入失败: ${importResponse.error}`);
      }
    } catch (error) {
      alert(`导入失败: ${error}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">设置</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            loadSettings();
            loadApiKeys();
          }}
        >
          刷新
        </Button>
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 成功提示 */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          保存成功
        </Alert>
      )}

      {/* API Key 管理 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="API Key 管理"
          subheader="支持配置多个 API Key，系统会自动轮询使用"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
            >
              添加 API Key
            </Button>
          }
        />
        <CardContent>
          {apiKeys.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                还没有配置 API Key，请点击上方按钮添加
              </Typography>
            </Box>
          ) : (
            apiKeys.map((apiKey, index) => {
              const stat = apiKeyStats[index];
              const percentage = stat ? stat.percentage : 0;
              
              return (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: apiKey.enabled ? 'background.paper' : 'action.disabledBackground',
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {apiKey.name}
                        {!apiKey.enabled && (
                          <Chip label="已禁用" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apiKey.key.substring(0, 12)}...
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ mb: 0.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(percentage, 100)}
                          color={percentage > 90 ? 'error' : percentage > 70 ? 'warning' : 'primary'}
                        />
                      </Box>
                      <Typography variant="caption">
                        今日已用: {apiKey.usedToday} / {apiKey.dailyLimit} ({percentage.toFixed(1)}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={apiKey.enabled}
                            onChange={() => handleToggleApiKey(index)}
                          />
                        }
                        label={apiKey.enabled ? '已启用' : '已禁用'}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(index)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteApiKey(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* 全局设置 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="全局设置" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>分页条数</InputLabel>
                <Select
                  value={pageSize}
                  label="分页条数"
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <MenuItem value={10}>10 条/页</MenuItem>
                  <MenuItem value={25}>25 条/页</MenuItem>
                  <MenuItem value={50}>50 条/页</MenuItem>
                  <MenuItem value={100}>100 条/页</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>主题风格</InputLabel>
                <Select
                  value={appTheme}
                  label="主题风格"
                  onChange={(e) => setAppTheme(e.target.value as ThemeMode)}
                >
                  <MenuItem value="cyberpunk">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#9D4EDD' }} />
                      🌟 赛博朋克（霓虹紫）
                    </Box>
                  </MenuItem>
                  <MenuItem value="matrix">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#00FF41' }} />
                      🟢 矩阵绿（黑客风）
                    </Box>
                  </MenuItem>
                  <MenuItem value="darkblue">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#00D9FF' }} />
                      🔵 暗夜蓝（科技蓝）
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                选择应用的整体视觉风格，保存后立即生效
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="批量搜索延迟（毫秒）"
                type="number"
                value={searchDelay}
                onChange={(e) => setSearchDelay(Number(e.target.value))}
                helperText="批量搜索时每次请求的间隔时间"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                }
                label="自动保存搜索结果"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                保存设置
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Supabase 数据库配置 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Supabase 数据库配置"
          subheader="配置 Supabase 云数据库服务，如未配置则使用本地数据库"
          action={
            <Chip 
              label={databaseMode === 'supabase' ? 'Supabase 模式' : '本地模式'} 
              color={databaseMode === 'supabase' ? 'success' : 'default'}
              size="small"
            />
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={supabaseConfig.enabled}
                    onChange={(e) => setSupabaseConfig({ ...supabaseConfig, enabled: e.target.checked })}
                  />
                }
                label="启用 Supabase 数据库"
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                启用后，所有数据将存储到 Supabase 云数据库；禁用则使用本地数据库
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Supabase URL"
                placeholder="https://your-project.supabase.co"
                value={supabaseConfig.url}
                onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                disabled={!supabaseConfig.enabled}
                helperText="Supabase 项目的 URL 地址"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Supabase API Key"
                placeholder="your-anon-key"
                value={supabaseConfig.key}
                onChange={(e) => setSupabaseConfig({ ...supabaseConfig, key: e.target.value })}
                disabled={!supabaseConfig.enabled}
                type="password"
                helperText="Supabase 项目的 Anon/Public API Key"
              />
            </Grid>
            {supabaseTestResult && (
              <Grid item xs={12}>
                <Alert severity={supabaseTestResult.success ? 'success' : 'error'}>
                  {supabaseTestResult.message}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleTestSupabaseConnection}
                  disabled={!supabaseConfig.enabled || supabaseTesting || !supabaseConfig.url || !supabaseConfig.key}
                >
                  {supabaseTesting ? '测试中...' : '测试连接'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSupabaseConfig}
                  disabled={!supabaseConfig.enabled || !supabaseConfig.url || !supabaseConfig.key}
                >
                  保存配置
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                <strong>数据库表结构说明：</strong>
                <br />
                需要在 Supabase 中创建以下表：
                <br />
                • <code>pois</code> - POI 数据表（主键：id）
                <br />
                • <code>city_codes</code> - 城市编码表（主键：adcode）
                <br />
                • <code>poi_type_codes</code> - POI 分类编码表（主键：code）
                <br />
                • <code>global_settings</code> - 全局设置表（主键：key）
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 数据导入管理 */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="数据导入管理"
          subheader="导入城市编码和 POI 分类编码数据"
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  当前数据统计
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        城市编码数据
                      </Typography>
                      <Typography variant="h5">
                        {dataStats.cityCodeCount} 条
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        POI 分类编码数据
                      </Typography>
                      <Typography variant="h5">
                        {dataStats.poiTypeCodeCount} 条
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={handleImportCityCodes}
                disabled={importing}
              >
                导入城市编码 CSV
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                CSV 格式：adcode,citycode,name,center,level
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={handleImportPoiTypeCodes}
                disabled={importing}
              >
                导入 POI 分类编码 CSV
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                CSV 格式：code,name,parentCode,level
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>说明：</strong>
                </Typography>
                <Typography variant="body2">
                  • 应用启动时会自动从 assets/data 目录加载默认数据
                </Typography>
                <Typography variant="body2">
                  • 如果数据库已有数据，则不会重复加载
                </Typography>
                <Typography variant="body2">
                  • 可以手动导入自定义的 CSV 文件更新数据
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          使用说明
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" paragraph>
          <strong>API Key 管理：</strong>
        </Typography>
        <Typography variant="body2" paragraph>
          • 可以添加多个 API Key，系统会自动轮询使用
        </Typography>
        <Typography variant="body2" paragraph>
          • 每个 Key 可以设置每日请求额度，超过额度后自动切换到下一个 Key
        </Typography>
        <Typography variant="body2" paragraph>
          • 可以随时启用或禁用某个 Key
        </Typography>
        <Typography variant="body2" paragraph sx={{ mt: 2 }}>
          <strong>获取 API Key：</strong>
        </Typography>
        <Typography variant="body2" paragraph>
          1. 访问高德开放平台（https://lbs.amap.com/）
        </Typography>
        <Typography variant="body2" paragraph>
          2. 注册账号并创建应用
        </Typography>
        <Typography variant="body2">
          3. 申请 Web 服务 API Key，然后在上方添加
        </Typography>
      </Paper>

      {/* 添加/编辑 API Key 对话框 */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIndex !== null ? '编辑 API Key' : '添加 API Key'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：主账号、备用账号1"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="API Key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="请输入高德地图 API Key"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="每日请求额度"
              type="number"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
              helperText="高德地图免费版每日额度为 10000 次"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                />
              }
              label="启用此 API Key"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>取消</Button>
          <Button onClick={handleSaveApiKey} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
