import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

/**
 * 类型化的 useDispatch Hook
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
