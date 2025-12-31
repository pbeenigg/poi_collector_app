import React, { useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { createAppTheme } from './theme/themes';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SavedPOIsPage from './pages/SavedPOIsPage';
import SettingsPage from './pages/SettingsPage';
import CityCodesPage from './pages/CityCodesPage';
import PoiTypeCodesPage from './pages/PoiTypeCodesPage';
import AboutPage from './pages/AboutPage';

/**
 * 应用内容组件（使用主题）
 */
const AppContent: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.settings.theme);
  
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/saved" element={<SavedPOIsPage />} />
            <Route path="/city-codes" element={<CityCodesPage />} />
            <Route path="/poi-type-codes" element={<PoiTypeCodesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

/**
 * 应用根组件
 */
const App: React.FC = () => {
  useEffect(() => {
    console.log('POI Collector App 已启动');
  }, []);

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
