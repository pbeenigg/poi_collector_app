import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { POI, SearchParams } from '../../shared/types/poi';

/**
 * POI 状态接口
 */
interface POIState {
  // 搜索结果
  searchResults: POI[];
  searchTotal: number;
  searchLoading: boolean;
  searchError: string | null;

  // 已保存的 POI
  savedPOIs: POI[];
  savedTotal: number;
  savedLoading: boolean;
  savedError: string | null;

  // 当前选中的 POI
  selectedPOIs: string[];

  // 分页
  currentPage: number;
  pageSize: number;
}

const initialState: POIState = {
  searchResults: [],
  searchTotal: 0,
  searchLoading: false,
  searchError: null,

  savedPOIs: [],
  savedTotal: 0,
  savedLoading: false,
  savedError: null,

  selectedPOIs: [],

  currentPage: 1,
  pageSize: 20,
};

/**
 * 异步操作：搜索 POI（关键字搜索）
 */
export const searchPOI = createAsyncThunk(
  'poi/search',
  async (params: SearchParams) => {
    const response = await window.electronAPI.searchPOI(params);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

/**
 * 异步操作：周边搜索 POI
 */
export const searchAroundPOI = createAsyncThunk(
  'poi/searchAround',
  async (params: any) => {
    const response = await window.electronAPI.searchAroundPOI(params);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

/**
 * 异步操作：保存 POI
 */
export const savePOI = createAsyncThunk('poi/save', async (poi: POI) => {
  const response = await window.electronAPI.savePOI(poi);
  if (!response.success) {
    throw new Error(response.error);
  }
  return poi;
});

/**
 * 异步操作：批量保存 POI
 */
export const saveBatchPOI = createAsyncThunk('poi/saveBatch', async (pois: POI[]) => {
  const response = await window.electronAPI.saveBatchPOI(pois);
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
});

/**
 * 异步操作：获取已保存的 POI
 */
export const fetchSavedPOIs = createAsyncThunk(
  'poi/fetchSaved',
  async ({ limit, offset }: { limit?: number; offset?: number } = {}) => {
    const response = await window.electronAPI.getAllPOIs(limit, offset);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

/**
 * 异步操作：本地搜索 POI
 */
export const searchLocalPOIs = createAsyncThunk('poi/searchLocal', async (keyword: string) => {
  const response = await window.electronAPI.searchLocalPOIs(keyword);
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
});

/**
 * 异步操作：删除 POI
 */
export const deletePOI = createAsyncThunk('poi/delete', async (id: string) => {
  const response = await window.electronAPI.deletePOI(id);
  if (!response.success) {
    throw new Error(response.error);
  }
  return id;
});

/**
 * 异步操作：获取 POI 总数
 */
export const fetchPOICount = createAsyncThunk('poi/fetchCount', async () => {
  const response = await window.electronAPI.getPOICount();
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
});

/**
 * POI Slice
 */
const poiSlice = createSlice({
  name: 'poi',
  initialState,
  reducers: {
    // 清空搜索结果
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTotal = 0;
      state.searchError = null;
    },

    // 清空错误
    clearError: (state) => {
      state.searchError = null;
      state.savedError = null;
    },

    // 设置当前页
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // 设置每页数量
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },

    // 选中 POI
    selectPOI: (state, action: PayloadAction<string>) => {
      if (!state.selectedPOIs.includes(action.payload)) {
        state.selectedPOIs.push(action.payload);
      }
    },

    // 取消选中 POI
    deselectPOI: (state, action: PayloadAction<string>) => {
      state.selectedPOIs = state.selectedPOIs.filter((id) => id !== action.payload);
    },

    // 全选
    selectAll: (state) => {
      state.selectedPOIs = state.searchResults.map((poi) => poi.id);
    },

    // 取消全选
    deselectAll: (state) => {
      state.selectedPOIs = [];
    },
  },
  extraReducers: (builder) => {
    // 搜索 POI（关键字搜索）
    builder
      .addCase(searchPOI.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchPOI.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.pois;
        state.searchTotal = action.payload.total;
      })
      .addCase(searchPOI.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || '搜索失败';
      });

    // 周边搜索 POI
    builder
      .addCase(searchAroundPOI.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchAroundPOI.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.pois;
        state.searchTotal = action.payload.total;
      })
      .addCase(searchAroundPOI.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || '周边搜索失败';
      });

    // 保存 POI
    builder
      .addCase(savePOI.fulfilled, (state) => {
        // 保存成功后可以刷新已保存列表
      })
      .addCase(savePOI.rejected, (state, action) => {
        state.savedError = action.error.message || '保存失败';
      });

    // 批量保存 POI
    builder
      .addCase(saveBatchPOI.pending, (state) => {
        state.savedLoading = true;
      })
      .addCase(saveBatchPOI.fulfilled, (state) => {
        state.savedLoading = false;
      })
      .addCase(saveBatchPOI.rejected, (state, action) => {
        state.savedLoading = false;
        state.savedError = action.error.message || '批量保存失败';
      });

    // 获取已保存的 POI
    builder
      .addCase(fetchSavedPOIs.pending, (state) => {
        state.savedLoading = true;
        state.savedError = null;
      })
      .addCase(fetchSavedPOIs.fulfilled, (state, action) => {
        state.savedLoading = false;
        state.savedPOIs = action.payload;
      })
      .addCase(fetchSavedPOIs.rejected, (state, action) => {
        state.savedLoading = false;
        state.savedError = action.error.message || '获取失败';
      });

    // 本地搜索 POI
    builder
      .addCase(searchLocalPOIs.pending, (state) => {
        state.savedLoading = true;
      })
      .addCase(searchLocalPOIs.fulfilled, (state, action) => {
        state.savedLoading = false;
        state.savedPOIs = action.payload;
      })
      .addCase(searchLocalPOIs.rejected, (state, action) => {
        state.savedLoading = false;
        state.savedError = action.error.message || '搜索失败';
      });

    // 删除 POI
    builder.addCase(deletePOI.fulfilled, (state, action) => {
      state.savedPOIs = state.savedPOIs.filter((poi) => poi.id !== action.payload);
    });

    // 获取 POI 总数
    builder.addCase(fetchPOICount.fulfilled, (state, action) => {
      state.savedTotal = action.payload;
    });
  },
});

export const {
  clearSearchResults,
  clearError,
  setPage,
  setPageSize,
  selectPOI,
  deselectPOI,
  selectAll,
  deselectAll,
} = poiSlice.actions;

export default poiSlice.reducer;
