import { createMuiTheme } from '@material-ui/core/styles';
import { purple, yellow } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: purple,
    secondary: yellow,
  },
});