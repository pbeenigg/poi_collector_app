import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../store';

/**
 * 类型化的 useSelector Hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
