import React from 'react';
import { Box, Typography, Paper, Grid, Chip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

/**
 * 关于项目页面
 */
const AboutPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      {/* 页面标题 */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        关于项目
      </Typography>

      {/* 核心功能 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          核心功能
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                POI 搜索
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持关键字搜索和周边搜索两种模式，可按城市、分类筛选，支持批量采集。
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                数据管理
              </Typography>
              <Typography variant="body2" color="text.secondary">
                本地 SQLite 存储，支持 Supabase 云端同步，数据导出为 CSV/JSON 格式。
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                智能采集
              </Typography>
              <Typography variant="body2" color="text.secondary">
                自动保存搜索结果，支持断点续传，批量采集时可设置延迟避免限流。
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="primary" />
                数据字典
              </Typography>
              <Typography variant="body2" color="text.secondary">
                内置城市编码和 POI 分类管理，支持导入导出，方便数据维护。
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 使用指南 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          使用指南
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                1
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="配置高德 API Key"
              secondary="在设置页面添加您的高德地图 API Key，支持多个 Key 轮询使用"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                2
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="选择搜索模式"
              secondary="关键字搜索：按名称、分类搜索；周边搜索：按坐标和半径搜索"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                3
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="执行搜索和采集"
              secondary="单次搜索或批量采集，支持自动保存和断点续传"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                4
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="管理和导出数据"
              secondary="在已保存数据页面查看、筛选、导出采集的 POI 数据"
            />
          </ListItem>
        </List>
      </Paper>

      {/* 技术特点 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          技术特点
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Chip label="Electron 桌面应用" color="primary" />
          <Chip label="React 19 + TypeScript" color="primary" />
          <Chip label="Material-UI 界面" color="primary" />
          <Chip label="Redux 状态管理" color="primary" />
          <Chip label="SQLite 本地存储" color="primary" />
          <Chip label="Supabase 云端同步" color="primary" />
          <Chip label="高德地图 API" color="primary" />
          <Chip label="Framer Motion 动画" color="primary" />
          <Chip label="Lucide React 图标" color="primary" />
        </Box>
      </Paper>
    </Box>
  );
};

export default AboutPage;
