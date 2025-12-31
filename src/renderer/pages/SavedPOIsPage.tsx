import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import { Search, Delete, FileDownload, Refresh } from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchSavedPOIs, searchLocalPOIs, deletePOI, fetchPOICount } from '../store/poiSlice';
import { fetchSettings } from '../store/settingsSlice';

/**
 * 已保存 POI 页面
 */
const SavedPOIsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { savedPOIs, savedTotal, savedLoading, savedError } = useAppSelector((state) => state.poi);
  const settings = useAppSelector((state) => state.settings);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    // 初始加载数据和设置
    dispatch(fetchSettings());
    dispatch(fetchSavedPOIs());
    dispatch(fetchPOICount());
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
   * 数据变化时重置分页
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [savedPOIs]);

  /**
   * 计算分页后的数据
   */
  const paginatedPOIs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return savedPOIs.slice(startIndex, endIndex);
  }, [savedPOIs, currentPage, pageSize]);

  /**
   * 刷新数据
   */
  const handleRefresh = () => {
    dispatch(fetchSavedPOIs());
    dispatch(fetchPOICount());
  };

  /**
   * 本地搜索
   */
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      dispatch(searchLocalPOIs(searchKeyword));
    } else {
      dispatch(fetchSavedPOIs());
    }
  };

  /**
   * 删除 POI
   */
  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除 "${name}" 吗？`)) {
      dispatch(deletePOI(id))
        .unwrap()
        .then(() => {
          dispatch(fetchPOICount());
        })
        .catch((error) => {
          alert(`删除失败: ${error}`);
        });
    }
  };

  /**
   * 导出数据
   */
  const handleExport = async () => {
    try {
      const response = await window.electronAPI.selectExportPath('poi_export.csv');
      if (!response.success || !response.data) {
        return;
      }

      const filePath = response.data;
      const exportResponse = await window.electronAPI.exportCSV(savedPOIs, filePath);

      if (exportResponse.success) {
        alert(`导出成功: ${exportResponse.data}`);
      } else {
        alert(`导出失败: ${exportResponse.error}`);
      }
    } catch (error) {
      alert(`导出失败: ${error}`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">已保存数据</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            刷新
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={handleExport}
            disabled={savedPOIs.length === 0}
          >
            导出 CSV
          </Button>
        </Box>
      </Box>

      {/* 搜索框 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="搜索名称、地址或类型..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={handleSearch}>搜索</Button>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 错误提示 */}
      {savedError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {savedError}
        </Alert>
      )}

      {/* 数据统计 */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        共有 {savedTotal} 条数据
      </Typography>

      {/* 数据表格 */}
      {savedLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : savedPOIs.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 180, maxWidth: 250 }}>名称</TableCell>
                <TableCell sx={{ minWidth: 120, maxWidth: 180 }}>类型</TableCell>
                <TableCell sx={{ minWidth: 200, maxWidth: 350 }}>地址</TableCell>
                <TableCell sx={{ minWidth: 100, maxWidth: 120 }}>城市</TableCell>
                <TableCell sx={{ minWidth: 100, maxWidth: 120 }}>区域</TableCell>
                <TableCell sx={{ minWidth: 150, maxWidth: 180 }}>坐标</TableCell>
                <TableCell sx={{ width: 80 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPOIs.map((poi) => (
                <TableRow key={poi.id} hover>
                  <TableCell>{poi.name}</TableCell>
                  <TableCell>{poi.type}</TableCell>
                  <TableCell>{poi.address}</TableCell>
                  <TableCell>{poi.cityname}</TableCell>
                  <TableCell>{poi.adname}</TableCell>
                  <TableCell>{poi.location}</TableCell>
                  <TableCell>
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(poi.id, poi.name)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={savedPOIs.length}
            page={currentPage - 1}
            onPageChange={(_, newPage) => setCurrentPage(newPage + 1)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            rowsPerPageOptions={[10, 50, 100]}
            labelRowsPerPage="每页显示"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 共 ${count} 条`}
          />
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">暂无数据</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SavedPOIsPage;
