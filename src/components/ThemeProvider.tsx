'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only run once client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {!mounted ? <div style={{ visibility: 'hidden' }}>{children}</div> : children}
    </MUIThemeProvider>
  );
} 