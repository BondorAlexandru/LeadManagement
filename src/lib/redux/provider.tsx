'use client';

import { Provider } from 'react-redux';
import { useMemo } from 'react';
import { store } from './store';

// Use memoized store for better performance and to avoid hydration issues
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeInstance = useMemo(() => store, []);
  
  return <Provider store={storeInstance}>{children}</Provider>;
} 