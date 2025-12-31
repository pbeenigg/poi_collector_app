import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Divider } from '@mui/material';
import { Home, Search, Storage, Settings, LocationCity, Category, Info } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

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
    { text: '搜索', icon: <Search />, path: '/search' },
    { text: '已保存', icon: <Storage />, path: '/saved' },
  ];

  const dataManagementItems = [
    { text: '城市编码', icon: <LocationCity />, path: '/city-codes' },
    { text: '地标分类', icon: <Category />, path: '/poi-type-codes' },
  ];

  const settingsItems = [
    { text: '设置', icon: <Settings />, path: '/settings' },
    { text: '关于', icon: <Info />, path: '/about' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', minWidth: '1024px' }}>

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
            borderRight: 'none',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Logo */}
        <Box 
          sx={{ 
            p: 2.5, 
            textAlign: 'center', 
            mt: 1.5,
            mb: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <img 
            src="assets/images/logo.png" 
            alt="Logo" 
            style={{ 
              maxWidth: '60%', 
              height: 'auto',
              maxHeight: '60px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(167, 139, 250, 0.3))'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              console.error('Logo图片加载失败');
            }}
          />
        </Box>
        <Box sx={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 主功能菜单 */}
          <List sx={{ px: 1.5, py: 0.5 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(167, 139, 250, 0.15)',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(167, 139, 250, 0.2)',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1.5, mx: 2, opacity: 0.3 }} />

          {/* 数据管理菜单 */}
          <List sx={{ px: 1.5, py: 0.5 }}>
            {dataManagementItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(167, 139, 250, 0.15)',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(167, 139, 250, 0.2)',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1.5, mx: 2, opacity: 0.3 }} />

          {/* 设置菜单 */}
          <List sx={{ px: 1.5, py: 0.5 }}>
            {settingsItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(167, 139, 250, 0.15)',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(167, 139, 250, 0.2)',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* 菜单底部图片 */}
        <Box 
          sx={{ 
            width: '100%',
            minHeight: 120,
            maxHeight: 150,
            height: '15vh',
            backgroundImage: 'url(assets/images/menu-bottom.jpg)',
            backgroundSize: 'contain',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            mt: 'auto',
            flexShrink: 0,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 1,
          }}
        />
      </Drawer>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          overflow: 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
