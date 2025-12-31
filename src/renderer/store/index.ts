import { configureStore } from '@reduxjs/toolkit';
import poiReducer from './poiSlice';
import settingsReducer from './settingsSlice';

/**
 * Redux Store 配置
 */
export const store = configureStore({
  reducer: {
    poi: poiReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
