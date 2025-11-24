import { useContext } from 'react';
import { LayoutContext } from '@/contexts/LayoutContext';

export const useLayout = () => useContext(LayoutContext);
