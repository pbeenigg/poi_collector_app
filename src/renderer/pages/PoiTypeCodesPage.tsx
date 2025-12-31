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
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Search } from '@mui/icons-material';

interface PoiTypeCode {
  code: string;
  name: string;
  parentCode?: string;
  level: number;
}

/**
 * POI 分类编码管理页面
 */
const PoiTypeCodesPage: React.FC = () => {
  const [data, setData] = useState<PoiTypeCode[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<PoiTypeCode>({
    code: '',
    name: '',
    parentCode: '',
    level: 1,
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
      const response = await window.electronAPI.getPoiTypeCodesPage(keyword, rowsPerPage, offset);
      if (response.success) {
        setData(response.data || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('加载 POI 分类编码失败', error);
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
      code: '',
      name: '',
      parentCode: '',
      level: 1,
    });
    setDialogOpen(true);
  };

  /**
   * 打开编辑对话框
   */
  const handleEdit = (typeCode: PoiTypeCode) => {
    setEditMode(true);
    setFormData({ ...typeCode });
    setDialogOpen(true);
  };

  /**
   * 保存
   */
  const handleSave = async () => {
    if (!formData.code || !formData.name) {
      alert('请填写分类编码和分类名称');
      return;
    }

    try {
      const response = await window.electronAPI.upsertPoiTypeCode(formData);
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
  const handleDelete = async (code: string) => {
    if (!confirm('确定要删除这条 POI 分类编码吗？')) {
      return;
    }

    try {
      const response = await window.electronAPI.deletePoiTypeCode(code);
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

  /**
   * 获取层级标签颜色
   */
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'primary';
      case 2:
        return 'secondary';
      case 3:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">地标分类</Typography>
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
              placeholder="输入分类名称或分类编码"
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
                  <TableCell sx={{ minWidth: 180, maxWidth: 280 }}>分类名称</TableCell>
                  <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>分类编码</TableCell>
                  <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>父级编码</TableCell>
                  <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>层级</TableCell>
                  <TableCell align="right" sx={{ width: 120 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.code} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.parentCode || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={`第 ${row.level} 级`}
                        color={getLevelColor(row.level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="编辑">
                        <IconButton size="small" onClick={() => handleEdit(row)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton size="small" onClick={() => handleDelete(row.code)}>
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
        <DialogTitle>{editMode ? '编辑 POI 分类编码' : '新增 POI 分类编码'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="分类名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="分类编码"
                placeholder="例如: 050000"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={editMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="父级编码"
                placeholder="例如: 05"
                value={formData.parentCode || ''}
                onChange={(e) => setFormData({ ...formData, parentCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="层级"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) })}
                inputProps={{ min: 1, max: 3 }}
                helperText="1=大类, 2=中类, 3=小类"
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

export default PoiTypeCodesPage;
