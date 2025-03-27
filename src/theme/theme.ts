import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#c2c2c2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#ea4335',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#666666',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#f5f5f5',
          '&.Mui-checked': {
            color: '#4CAF50',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#4CAF50',
          },
        },
        track: {
          backgroundColor: '#c2c2c2',
        },
      },
    },
  },
});

export default theme; 