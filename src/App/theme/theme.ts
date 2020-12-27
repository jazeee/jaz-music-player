import { createMuiTheme } from '@material-ui/core/styles';
import { purple, orange } from '@material-ui/core/colors';

export const baseTheme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: purple,
    secondary: orange,
    text: {
      secondary: '#000',
    }
  },
  typography: {
    h1: {
      fontSize: "2rem"
    },
    h2: {
      fontSize: "1.75rem"
    },
    h3: {
      fontSize: "1.5rem"
    },
    h4: {
      fontSize: "1.25rem"
    },
    h5: {
      fontSize: "1rem"
    },
    h6: {
      fontSize: "0.875rem"
    },
  },
});

export const theme = createMuiTheme({
  ...baseTheme,
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&$selected': {
            backgroundColor: orange.A700,
            '&:hover': {
              backgroundColor: orange[500],
            },
          },
        },
      }
    },
  },
});
