import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

/**
 * 设置状态接口
 */
export type ThemeMode = 'cyberpunk' | 'matrix' | 'darkblue';

export interface SettingsState {
  amapApiKey: string;
  dbPath: string;
  logLevel: string;
  lastExportPath: string;
  pageSize: number;
  autoSave: boolean;
  searchDelay: number;
  theme: ThemeMode;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  amapApiKey: '',
  dbPath: '',
  logLevel: 'info',
  lastExportPath: '',
  pageSize: 25,
  autoSave: false,
  searchDelay: 1000,
  theme: 'cyberpunk',
  loading: false,
  error: null,
};

/**
 * 异步操作：获取设置
 */
export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  const response = await window.electronAPI.getSettings();
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
});

/**
 * 异步操作：保存设置
 */
export const saveSettings = createAsyncThunk(
  'settings/save',
  async (settings: Partial<SettingsState>) => {
    const response = await window.electronAPI.setSettings(settings);
    if (!response.success) {
      throw new Error(response.error);
    }
    return settings;
  }
);

/**
 * 异步操作：设置 API Key
 */
export const setApiKey = createAsyncThunk('settings/setApiKey', async (apiKey: string) => {
  const response = await window.electronAPI.setApiKey(apiKey);
  if (!response.success) {
    throw new Error(response.error);
  }
  return apiKey;
});

/**
 * 设置 Slice
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // 更新本地设置（不保存到配置文件）
    updateLocalSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
    },

    // 清空错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取设置
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取设置失败';
      });

    // 保存设置
    builder
      .addCase(saveSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '保存设置失败';
      });

    // 设置 API Key
    builder
      .addCase(setApiKey.fulfilled, (state, action) => {
        state.amapApiKey = action.payload;
      })
      .addCase(setApiKey.rejected, (state, action) => {
        state.error = action.error.message || '设置 API Key 失败';
      });
  },
});

export const { updateLocalSettings, clearError } = settingsSlice.actions;

export default settingsSlice.reducer;
