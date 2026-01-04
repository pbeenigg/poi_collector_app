import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  TablePagination,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Save, 
  SaveAlt, 
  MyLocation, 
  Collections,
  Stop,
} from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { searchPOI, searchAroundPOI, savePOI, saveBatchPOI, selectPOI, deselectPOI, selectAll, deselectAll } from '../store/poiSlice';
import { fetchSettings } from '../store/settingsSlice';

interface CityCode {
  adcode: string;
  citycode: string;
  name: string;
  center: string;
  level: string;
}

interface PoiTypeCode {
  code: string;
  name: string;
  parentCode?: string;
  level: number;
}

/**
 * POI 搜索页面
 */
const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchResults, searchTotal, searchLoading, searchError, selectedPOIs } = useAppSelector(
    (state) => state.poi
  );
  const settings = useAppSelector((state) => state.settings);

  // API分页状态（用于控制API请求的页码）
  const [apiPageNum, setApiPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // 自动保存状态
  const [autoSaveSuccess, setAutoSaveSuccess] = useState(false);

  // 搜索模式
  const [searchMode, setSearchMode] = useState<'text' | 'around'>(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) { // 10分钟
        return data.searchMode || 'text';
      }
    }
    return 'text';
  });
  
  // 关键字搜索参数
  const [keywords, setKeywords] = useState(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.keywords || '';
      }
    }
    return '';
  });
  const [types, setTypes] = useState(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.types || '';
      }
    }
    return '';
  });
  const [region, setRegion] = useState(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.region || '';
      }
    }
    return '';
  });
  const [pageNum, setPageNum] = useState(1);
  
  // 周边搜索参数
  const [location, setLocation] = useState(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.location || '';
      }
    }
    return '';
  });
  const [radius, setRadius] = useState(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.radius || 5000;
      }
    }
    return 5000;
  });
  
  // 批量采集状态
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchCollecting, setBatchCollecting] = useState(false);
  const [batchProgress, setBatchProgress] = useState({
    current: 0,
    total: 0,
    collected: 0,
    currentTask: '',
  });

  // 城市和分类选择状态
  const [selectedCity, setSelectedCity] = useState<CityCode | null>(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.selectedCity || null;
      }
    }
    return null;
  });
  const [cityOptions, setCityOptions] = useState<CityCode[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  const [selectedPoiType, setSelectedPoiType] = useState<PoiTypeCode | null>(() => {
    const cached = localStorage.getItem('poi_search_cache');
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - data.timestamp < 10 * 60 * 1000) {
        return data.selectedPoiType || null;
      }
    }
    return null;
  });
  const [poiTypeOptions, setPoiTypeOptions] = useState<PoiTypeCode[]>([]);
  const [poiTypeLoading, setPoiTypeLoading] = useState(false);

  /**
   * 搜索城市（异步）
   */
  const handleCitySearch = async (inputValue: string) => {
    setCityLoading(true);
    try {
      // 如果输入为空，获取前5条数据作为默认选项
      const searchKeyword = inputValue && inputValue.trim().length > 0 ? inputValue : '北京';
      const response = await window.electronAPI.searchCityCodes(searchKeyword, 5);
      if (response.success) {
        setCityOptions(response.data || []);
      }
    } catch (error) {
      console.error('搜索城市失败', error);
    } finally {
      setCityLoading(false);
    }
  };

  /**
   * 搜索 POI 分类（异步）
   */
  const handlePoiTypeSearch = async (inputValue: string) => {
    setPoiTypeLoading(true);
    try {
      // 如果输入为空，获取前5条数据作为默认选项
      const searchKeyword = inputValue && inputValue.trim().length > 0 ? inputValue : '汽车';
      const response = await window.electronAPI.searchPoiTypeCodes(searchKeyword, 5);
      if (response.success) {
        setPoiTypeOptions(response.data || []);
      }
    } catch (error) {
      console.error('搜索 POI 分类失败', error);
    } finally {
      setPoiTypeLoading(false);
    }
  };

  /**
   * 初始化设置
   */
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  /**
   * 同步全局设置的分页大小
   */
  useEffect(() => {
    if (settings.pageSize) {
      setPageSize(settings.pageSize);
    }
  }, [settings.pageSize]);

  /**
   * 监听批量采集进度
   */
  useEffect(() => {
    window.electronAPI.onBatchCollectProgress((progress: any) => {
      setBatchProgress(progress);
    });
  }, []);

  /**
   * 监听搜索结果变化，自动保存
   */
  useEffect(() => {
    let isMounted = true;
    const autoSaveResults = async () => {
      // 确保设置已加载且启用自动保存
      if (isMounted && settings.autoSave === true && searchResults.length > 0 && !searchLoading) {
        try {
          const response = await window.electronAPI.saveBatchPOI(searchResults);
          if (response.success) {
            console.log(`自动保存了 ${searchResults.length} 条搜索结果`);
            setAutoSaveSuccess(true);
            // 3秒后隐藏提示
            setTimeout(() => {
              if (isMounted) {
                setAutoSaveSuccess(false);
              }
            }, 3000);
          }
        } catch (error) {
          console.error('自动保存失败', error);
          setAutoSaveSuccess(false);
        }
      }
    };
    // 延迟执行，避免在搜索过程中触发
    const timer = setTimeout(autoSaveResults, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchResults, settings.autoSave, searchLoading]);

  /**
   * 缓存搜索条件（10分钟有效期）
   */
  useEffect(() => {
    const cacheData = {
      searchMode,
      keywords,
      types,
      region,
      location,
      radius,
      selectedCity,
      selectedPoiType,
      timestamp: Date.now(),
    };
    localStorage.setItem('poi_search_cache', JSON.stringify(cacheData));
  }, [searchMode, keywords, types, region, location, radius, selectedCity, selectedPoiType]);

  /**
   * 搜索参数变化时重置页码
   */
  useEffect(() => {
    setApiPageNum(1);
  }, [searchMode, keywords, types, region, location, radius, selectedCity, selectedPoiType]);

  /**
   * 执行搜索
   */
  const handleSearch = () => {
    if (searchMode === 'text') {
      // 关键字搜索
      if (!keywords && !types && !selectedCity && !selectedPoiType) {
        alert('请输入关键词或选择城市/POI 分类');
        return;
      }

      const searchRegion = selectedCity ? selectedCity.adcode : region;
      const searchTypes = selectedPoiType ? selectedPoiType.code : types;

      dispatch(
        searchPOI({
          keywords: keywords || undefined,
          types: searchTypes || undefined,
          region: searchRegion || undefined,
          page_num: apiPageNum,
          page_size: pageSize,
        })
      );
    } else {
      // 周边搜索
      if (!location) {
        alert('请输入中心点坐标');
        return;
      }

      handleAroundSearch();
    }
  };

  /**
   * 周边搜索
   */
  const handleAroundSearch = () => {
    // 清理坐标输入（去除空格、制表符等）
    const cleanedLocation = location.trim().replace(/\s+/g, '');
    
    // 验证坐标格式
    const locationPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    if (!locationPattern.test(cleanedLocation)) {
      alert('坐标格式不正确，请使用格式：经度,纬度（例如：116.397428,39.90923）');
      return;
    }
    
    const searchTypes = selectedPoiType ? selectedPoiType.code : types;
    const searchRegion = selectedCity ? selectedCity.adcode : region;

    // 使用 Redux action 处理周边搜索
    dispatch(
      searchAroundPOI({
        location: cleanedLocation,
        radius,
        keywords: keywords || undefined,
        types: searchTypes || undefined,
        region: searchRegion || undefined,
        page_num: apiPageNum,
        page_size: pageSize,
      })
    );
  };

  /**
   * 打开批量采集对话框
   */
  const handleOpenBatchCollect = () => {
    if (!selectedPoiType && !types) {
      alert('请先选择 POI 分类');
      return;
    }
    if (!selectedCity && !region) {
      alert('请先选择城市');
      return;
    }
    setBatchDialogOpen(true);
  };

  /**
   * 开始批量采集
   */
  const handleStartBatchCollect = async () => {
    setBatchCollecting(true);
    
    try {
      const searchTypes = selectedPoiType ? [selectedPoiType.code] : [types];
      const searchRegions = selectedCity ? [selectedCity.adcode] : [region];

      const response = await window.electronAPI.batchCollectPOI({
        types: searchTypes,
        regions: searchRegions,
        pageSize: pageSize,
        maxPages: 25,
        delay: settings.searchDelay || 1000,
      });

      if (response.success) {
        // 自动保存采集结果
        const saveResponse = await window.electronAPI.saveBatchPOI(response.data.pois);
        
        if (saveResponse.success) {
          alert(`批量采集完成！\n共采集 ${response.data.total} 条数据\n已保存到数据库`);
        } else {
          alert(`采集完成但保存失败: ${saveResponse.error}`);
        }
      } else {
        alert(`批量采集失败: ${response.error}`);
      }
    } catch (error) {
      alert(`批量采集失败: ${error}`);
    } finally {
      setBatchCollecting(false);
      setBatchDialogOpen(false);
      setBatchProgress({ current: 0, total: 0, collected: 0, currentTask: '' });
    }
  };

  /**
   * 停止批量采集
   */
  const handleStopBatchCollect = async () => {
    try {
      await window.electronAPI.stopBatchCollect();
    } catch (error) {
      console.error('停止批量采集失败', error);
    }
  };

  /**
   * 保存单个 POI
   */
  const handleSaveSingle = (poi: any) => {
    dispatch(savePOI(poi))
      .unwrap()
      .then(() => {
        alert('保存成功');
      })
      .catch((error) => {
        alert(`保存失败: ${error}`);
      });
  };

  /**
   * 批量保存选中的 POI
   */
  const handleSaveBatch = () => {
    const selectedData = searchResults.filter((poi) => selectedPOIs.includes(poi.id));
    if (selectedData.length === 0) {
      alert('请先选择要保存的数据');
      return;
    }

    dispatch(saveBatchPOI(selectedData))
      .unwrap()
      .then((count) => {
        alert(`成功保存 ${count} 条数据`);
        dispatch(deselectAll());
      })
      .catch((error) => {
        alert(`批量保存失败: ${error}`);
      });
  };

  /**
   * 切换选中状态
   */
  const handleToggleSelect = (id: string) => {
    if (selectedPOIs.includes(id)) {
      dispatch(deselectPOI(id));
    } else {
      dispatch(selectPOI(id));
    }
  };

  /**
   * 全选/取消全选
   */
  const handleToggleSelectAll = () => {
    if (selectedPOIs.length === searchResults.length) {
      dispatch(deselectAll());
    } else {
      dispatch(selectAll());
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        POI搜索
      </Typography>

      {/* 搜索表单 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* 搜索模式切换 */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={searchMode}
            exclusive
            onChange={(_, newMode) => newMode && setSearchMode(newMode)}
            size="small"
          >
            <ToggleButton value="text">
              <SearchIcon sx={{ mr: 1 }} />
              关键字搜索
            </ToggleButton>
            <ToggleButton value="around">
              <MyLocation sx={{ mr: 1 }} />
              周边搜索
            </ToggleButton>
          </ToggleButtonGroup>
          <Chip 
            label={searchMode === 'text' ? '当前模式：关键字搜索' : '当前模式：周边搜索'} 
            color="primary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Box>

        <Grid container spacing={2}>
          {/* 关键词输入（两种模式都可用） */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="关键词"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如: 餐厅"
            />
          </Grid>

          {/* 周边搜索专用字段 */}
          {searchMode === 'around' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  label="中心点坐标"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="经度,纬度 (例如: 116.397428,39.90923)"
                  helperText="格式：经度,纬度"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="搜索半径（米）"
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  inputProps={{ min: 0, max: 50000 }}
                  helperText="范围：0-50000米"
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={4}>
            <Autocomplete
              fullWidth
              options={cityOptions}
              value={selectedCity}
              loading={cityLoading}
              getOptionLabel={(option) => `${option.name} (${option.adcode})`}
              isOptionEqualToValue={(option, value) => option.adcode === value.adcode}
              onOpen={() => {
                // 打开下拉框时，如果没有选项，加载默认数据
                if (cityOptions.length === 0) {
                  handleCitySearch('');
                }
              }}
              onInputChange={(_, newInputValue) => {
                handleCitySearch(newInputValue);
              }}
              onChange={(_, newValue) => {
                setSelectedCity(newValue);
                setRegion(newValue ? newValue.adcode : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="选择城市"
                  placeholder="输入城市名称搜索"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              fullWidth
              options={poiTypeOptions}
              value={selectedPoiType}
              loading={poiTypeLoading}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              onOpen={() => {
                // 打开下拉框时，如果没有选项，加载默认数据
                if (poiTypeOptions.length === 0) {
                  handlePoiTypeSearch('');
                }
              }}
              onInputChange={(_, newInputValue) => {
                handlePoiTypeSearch(newInputValue);
              }}
              onChange={(_, newValue) => {
                setSelectedPoiType(newValue);
                setTypes(newValue ? newValue.code : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="选择 POI 分类"
                  placeholder="输入分类名称搜索"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {poiTypeLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? '搜索中...' : '搜索'}
            </Button>
            
            {/* 批量采集按钮 */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Collections />}
              onClick={handleOpenBatchCollect}
              disabled={searchLoading}
              sx={{ ml: 2 }}
            >
              批量采集
            </Button>
            
            {selectedPOIs.length > 0 && (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveAlt />}
                onClick={handleSaveBatch}
                sx={{ ml: 2 }}
              >
                批量保存 ({selectedPOIs.length})
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* 错误提示 */}
      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {searchError}
        </Alert>
      )}

      {/* 搜索结果 */}
      {searchLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : searchResults.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              共找到 {searchTotal} 条结果
            </Typography>
            {autoSaveSuccess && (
              <Chip 
                label="已自动保存" 
                color="success" 
                size="small"
                icon={<Save />}
              />
            )}
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: 60 }}>
                    <Checkbox
                      checked={selectedPOIs.length === searchResults.length && searchResults.length > 0}
                      indeterminate={selectedPOIs.length > 0 && selectedPOIs.length < searchResults.length}
                      onChange={handleToggleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, maxWidth: 250 }}>名称</TableCell>
                  <TableCell sx={{ minWidth: 120, maxWidth: 180 }}>类型</TableCell>
                  <TableCell sx={{ minWidth: 200, maxWidth: 350 }}>地址</TableCell>
                  <TableCell sx={{ minWidth: 100, maxWidth: 120 }}>城市</TableCell>
                  <TableCell sx={{ width: 80 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((poi) => (
                  <TableRow key={poi.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedPOIs.includes(poi.id)}
                        onChange={() => handleToggleSelect(poi.id)}
                      />
                    </TableCell>
                    <TableCell>{poi.name}</TableCell>
                    <TableCell>{poi.type}</TableCell>
                    <TableCell>{poi.address}</TableCell>
                    <TableCell>{poi.cityname}</TableCell>
                    <TableCell>
                      <Tooltip title="保存">
                        <IconButton size="small" onClick={() => handleSaveSingle(poi)}>
                          <Save fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* API分页控制 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                每页显示：
              </Typography>
              <TextField
                select
                size="small"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value, 10));
                  setApiPageNum(1);
                }}
                SelectProps={{
                  native: true,
                }}
                sx={{ width: 100 }}
              >
                <option value={10}>10 条</option>
                <option value={25}>25 条</option>
                <option value={50}>50 条</option>
                <option value={100}>100 条</option>
              </TextField>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                disabled={apiPageNum === 1}
                onClick={() => {
                  setApiPageNum(prev => prev - 1);
                  setTimeout(() => handleSearch(), 100);
                }}
              >
                上一页
              </Button>
              
              <Typography variant="body2">
                第 {apiPageNum} 页
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                disabled={searchResults.length < pageSize}
                onClick={() => {
                  setApiPageNum(prev => prev + 1);
                  setTimeout(() => handleSearch(), 100);
                }}
              >
                下一页
              </Button>
            </Box>
          </Box>
        </>
      ) : null}

      {/* 批量采集对话框 */}
      <Dialog 
        open={batchDialogOpen} 
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={batchCollecting}
      >
        <DialogTitle>
          批量采集 POI
          {batchCollecting && (
            <Chip label="采集中" color="primary" size="small" sx={{ ml: 2 }} />
          )}
        </DialogTitle>
        <DialogContent>
          {!batchCollecting ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" gutterBottom>
                将按以下条件批量采集 POI 数据：
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  <strong>POI 分类：</strong>{selectedPoiType?.name || types || '未选择'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                  <strong>城市区域：</strong>{selectedCity?.name || region || '未选择'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                  <strong>每页数量：</strong>{pageSize} 条
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                  <strong>最大页数：</strong>25 页
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                  <strong>请求延迟：</strong>{settings.searchDelay || 1000} 毫秒
                </Typography>
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                批量采集将自动分页获取数据，并在完成后自动保存到数据库。
              </Alert>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" gutterBottom>
                进度: {batchProgress.current} / {batchProgress.total} 个任务
              </Typography>
              <Typography variant="body1" gutterBottom>
                已采集: <strong>{batchProgress.collected}</strong> 条数据
              </Typography>
              <Typography variant="body2" color="text.secondary">
                当前任务: {batchProgress.currentTask || '准备中...'}
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                正在采集中，请勿关闭窗口...
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {batchCollecting ? (
            <Button 
              onClick={handleStopBatchCollect} 
              color="error"
              startIcon={<Stop />}
            >
              停止采集
            </Button>
          ) : (
            <>
              <Button onClick={() => setBatchDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleStartBatchCollect} 
                variant="contained" 
                color="primary"
                startIcon={<Collections />}
              >
                开始采集
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchPage;
