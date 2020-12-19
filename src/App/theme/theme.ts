import { createMuiTheme } from '@material-ui/core/styles';
import { purple, orange } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: purple[500],
    },
    secondary: {
      main: orange[500],
    },
  },
});