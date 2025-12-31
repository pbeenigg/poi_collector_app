import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.scss';

/**
 * 渲染应用
 */
const container = document.getElementById('root');
if (!container) {
  throw new Error('根元素未找到');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
