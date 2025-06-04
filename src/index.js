import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// MUI components for theme setup
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//  Custom MUI theme defined here
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // A shade of indigo
    },
    secondary: {
      main: '#f50057', // A shade of pink
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents uppercase transformation
          padding: '8px 16px', // Custom padding
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3f51b5', // Matches primary color
        },
      },
    },
  },
  shape: {
    borderRadius: 8, // Custom border radius for components
  },
  spacing: 8, // Custom spacing unit
  direction: 'ltr', // Sets the text direction to left-to-right
  mixins: {
    toolbar: {
      minHeight: 64, // Custom height for the toolbar
    },
  },
  zIndex: {
    appBar: 1200, // Custom z-index for AppBar
    drawer: 1100, // Custom z-index for Drawer
  },
  shadows: ['none', '0px 2px 4px rgba(0, 0, 0, 0.1)', '0px 3px 5px rgba(0, 0, 0, 0.15)'], // Custom shadows
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap your App component with ThemeProvider and CssBaseline */}
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);