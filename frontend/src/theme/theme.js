import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2', // Main blue
      },
      secondary: {
        main: '#ef5350',
      },
      background: {
        default: isDark ? '#121212' : '#f3f2ef',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#000000',
        secondary: isDark ? '#aaaaaa' : '#666666',
      },
      divider: isDark ? '#333333' : '#e0e0e0',
    },
    typography: {
      fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          outlined: {
            borderColor: isDark ? '#333333' : '#e0e0e0',
          }
        }
      }
    },
  });
};

export default getTheme;
