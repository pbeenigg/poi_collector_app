import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Divider } from '@mui/material';
import { Home, Search, Storage, Settings, LocationCity, Category } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 应用布局组件
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: '首页', icon: <Home />, path: '/' },
    { text: 'POI 搜索', icon: <Search />, path: '/search' },
    { text: '已保存数据', icon: <Storage />, path: '/saved' },
  ];

  const dataManagementItems = [
    { text: '城市编码管理', icon: <LocationCity />, path: '/city-codes' },
    { text: 'POI 分类管理', icon: <Category />, path: '/poi-type-codes' },
  ];

  const settingsItems = [
    { text: '设置', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 顶部导航栏 */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            POI 数据采集器
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 侧边栏 */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        {/* Logo */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <img 
            src="assets/images/logo.png" 
            alt="Logo" 
            style={{ maxWidth: '80%', height: 'auto' }}
            onError={(e) => {
              // 如果图片加载失败，隐藏图片
              (e.target as HTMLImageElement).style.display = 'none';
              console.error('Logo图片加载失败');
            }}
          />
        </Box>
        <Box sx={{ overflow: 'auto', mt: 2, flex: 1 }}>
          {/* 主功能菜单 */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* 数据管理菜单 */}
          <List>
            <ListItem>
              <ListItemText 
                primary="数据管理" 
                primaryTypographyProps={{ 
                  variant: 'caption', 
                  color: 'text.secondary',
                  sx: { fontWeight: 'bold', px: 2 }
                }} 
              />
            </ListItem>
            {dataManagementItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* 设置菜单 */}
          <List>
            {settingsItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* 菜单底部图片 */}
        <Box 
          sx={{ 
            width: '100%',
            height: 120,
            backgroundImage: 'url(assets/images/menu-bottom.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mt: 'auto',
          }}
        />
      </Drawer>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
