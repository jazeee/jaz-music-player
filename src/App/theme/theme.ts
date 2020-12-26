import { createMuiTheme } from '@material-ui/core/styles';
import { purple, orange } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: purple,
    secondary: orange,
  },
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
