import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { MuiThemeOptions } from './_muiTheme';
import GlobalStyling from './globalStyles';

// Mui theme set up provider for whole application

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useMemo(() => {
    return createTheme(MuiThemeOptions('light'));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme)} />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
