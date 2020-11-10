import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';
import { LoadingProvider } from './components/Loading/LoadingProvider';
import { Navbar } from './components/Navbar';
import { SnackbarProvider } from './components/SnackbarProvider';
import Spinner from './components/Spinner';
import AppRouter from './routes/AppRouter';
import theme from './theme';

function App() {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter>
              <Spinner />
              <Navbar/>
              <Box paddingTop="70px">
                <Breadcrumbs></Breadcrumbs>
                <AppRouter/>
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
