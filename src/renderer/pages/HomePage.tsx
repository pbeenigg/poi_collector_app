import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Search,
  Save,
  Cloud,
  Settings,
  TrendingUp,
  CheckCircle,
  MyLocation,
  Collections,
} from '@mui/icons-material';

/**
 * 首页组件
 */
const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    poiCount: 0,
    cityCodeCount: 0,
    poiTypeCodeCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  /**
   * 加载数据统计
   */
  const loadStats = async () => {
    try {
      const poiResponse = await window.electronAPI.getPOICount();
      const cityResponse = await window.electronAPI.getCityCodeCount();
      const typeResponse = await window.electronAPI.getPoiTypeCodeCount();

      setStats({
        poiCount: poiResponse.success ? poiResponse.data : 0,
        cityCodeCount: cityResponse.success ? cityResponse.data : 0,
        poiTypeCodeCount: typeResponse.success ? typeResponse.data : 0,
      });
    } catch (error) {
      console.error('加载统计数据失败', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(assets/images/image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        {/* 欢迎标题 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            POI 采集器
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            高效、智能的地理位置数据采集工具
          </Typography>
        </Box>

        {/* 数据统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 48, color: '#9c27b0', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  {stats.poiCount.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  已采集 POI 数量
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <MyLocation sx={{ fontSize: 48, color: '#7b1fa2', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                  {stats.cityCodeCount.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  城市数据
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Collections sx={{ fontSize: 48, color: '#6a1b9a', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                  {stats.poiTypeCodeCount.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  POI 分类
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 功能介绍 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                核心功能
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Search sx={{ color: '#9c27b0' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="关键字搜索"
                    secondary="支持按关键词、城市、POI分类进行精准搜索"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MyLocation sx={{ color: '#7b1fa2' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="周边搜索"
                    secondary="以指定坐标为中心，搜索周边指定半径内的POI"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Collections sx={{ color: '#6a1b9a' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="批量采集"
                    secondary="自动分页采集，支持断点续采，最多可采集25页数据"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Save sx={{ color: '#4a148c' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="自动保存"
                    secondary="可配置自动保存搜索结果，无需手动操作"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Cloud sx={{ color: '#311b92' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="云端存储"
                    secondary="支持Supabase云端数据库，实现多端数据同步"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                使用指南
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        1. 配置 API Key
                      </Typography>
                    }
                    secondary="在设置页面添加高德地图 API Key，支持多个Key轮询使用"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        2. 导入基础数据
                      </Typography>
                    }
                    secondary="导入城市编码和POI分类编码，方便搜索时快速选择"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        3. 开始搜索
                      </Typography>
                    }
                    secondary="选择搜索模式（关键字/周边），设置筛选条件，点击搜索"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        4. 保存数据
                      </Typography>
                    }
                    secondary="选择需要的POI数据，批量保存到本地或云端数据库"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        5. 导出使用
                      </Typography>
                    }
                    secondary="在数据管理页面查看、搜索、导出已保存的POI数据"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* 技术特点 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Paper
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              技术特点
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
              <Chip label="Electron 桌面应用" color="primary" />
              <Chip label="React + TypeScript" color="primary" />
              <Chip label="Material-UI 界面" color="primary" />
              <Chip label="Redux 状态管理" color="primary" />
              <Chip label="SQLite 本地存储" color="primary" />
              <Chip label="Supabase 云端同步" color="primary" />
              <Chip label="高德地图 API" color="primary" />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
