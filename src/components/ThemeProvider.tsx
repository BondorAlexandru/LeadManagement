'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import { NoSsr } from '@mui/material';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // This ensures that the themes don't mismatch between server and client
  // by skipping server-side rendering of the theme entirely
  return (
    <NoSsr>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </NoSsr>
  );
} 