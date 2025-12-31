import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Search } from '@mui/icons-material';

interface CityCode {
  adcode: string;
  citycode: string;
  name: string;
  center: string;
  level: string;
}

/**
 * 城市编码管理页面
 */
const CityCodesPage: React.FC = () => {
  const [data, setData] = useState<CityCode[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CityCode>({
    adcode: '',
    citycode: '',
    name: '',
    center: '',
    level: '',
  });

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage]);

  /**
   * 加载数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const offset = page * rowsPerPage;
      const response = await window.electronAPI.getCityCodesPage(keyword, rowsPerPage, offset);
      if (response.success) {
        setData(response.data || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('加载城市编码失败', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 搜索
   */
  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  /**
   * 打开新增对话框
   */
  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      adcode: '',
      citycode: '',
      name: '',
      center: '',
      level: '',
    });
    setDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const handleEdit = (cityCode: CityCode) => {
    setEditMode(true);
    setFormData({ ...cityCode });
    setDialogOpen(true);
  };

  /**
   * 保存
   */
  const handleSave = async () => {
    if (!formData.adcode || !formData.name) {
      alert('请填写行政区划代码和城市名称');
      return;
    }

    try {
      const response = await window.electronAPI.upsertCityCode(formData);
      if (response.success) {
        alert('保存成功');
        setDialogOpen(false);
        loadData();
      } else {
        alert(`保存失败: ${response.error}`);
      }
    } catch (error) {
      alert(`保存失败: ${error}`);
    }
  };

  /**
   * 删除
   */
  const handleDelete = async (adcode: string) => {
    if (!confirm('确定要删除这条城市编码吗？')) {
      return;
    }

    try {
      const response = await window.electronAPI.deleteCityCode(adcode);
      if (response.success) {
        alert('删除成功');
        loadData();
      } else {
        alert(`删除失败: ${response.error}`);
      }
    } catch (error) {
      alert(`删除失败: ${error}`);
    }
  };

  /**
   * 分页变化
   */
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * 每页行数变化
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">城市编码管理</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            sx={{ mr: 1 }}
          >
            刷新
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            新增
          </Button>
        </Box>
      </Box>

      {/* 搜索栏 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              label="搜索"
              placeholder="输入城市名称、行政区划代码或城市代码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
            >
              搜索
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 数据表格 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>城市名称</TableCell>
                  <TableCell>行政区划代码</TableCell>
                  <TableCell>城市代码</TableCell>
                  <TableCell>中心坐标</TableCell>
                  <TableCell>级别</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.adcode} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.adcode}</TableCell>
                    <TableCell>{row.citycode || '-'}</TableCell>
                    <TableCell>{row.center || '-'}</TableCell>
                    <TableCell>{row.level || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="编辑">
                        <IconButton size="small" onClick={() => handleEdit(row)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton size="small" onClick={() => handleDelete(row.adcode)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每页行数"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 共 ${count} 条`}
          />
        </>
      )}

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? '编辑城市编码' : '新增城市编码'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="城市名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="行政区划代码"
                value={formData.adcode}
                onChange={(e) => setFormData({ ...formData, adcode: e.target.value })}
                disabled={editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="城市代码"
                value={formData.citycode}
                onChange={(e) => setFormData({ ...formData, citycode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="中心坐标"
                placeholder="例如: 116.405285,39.904989"
                value={formData.center}
                onChange={(e) => setFormData({ ...formData, center: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="级别"
                placeholder="例如: province, city, district"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleSave}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CityCodesPage;
