import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', pt: 6, px: 4, pb: 6 }}>

        {/* 欢迎标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 1,
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              POI（地标）数据采集器
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              高效、智能的地理位置数据采集工具
            </Typography>
          </Box>
        </motion.div>

        {/* 数据统计卡片 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#A78BFA', mb: 1.5 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                  {stats.poiCount.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  已采集 POI 数量
                </Typography>
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <MyLocation sx={{ fontSize: 40, color: '#60A5FA', mb: 1.5 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                    {stats.cityCodeCount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    城市数据
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Collections sx={{ fontSize: 40, color: '#F472B6', mb: 1.5 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                    {stats.poiTypeCodeCount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    地标分类
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
