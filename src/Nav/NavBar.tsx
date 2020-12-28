import { AppBar, IconButton, Toolbar, Button, FormGroup, FormControlLabel, Switch, styled, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { yellow } from "@material-ui/core/colors";
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";
import { useAppStateContext } from "../App/state/AppStateProvider";
import { baseTheme } from "../App/theme/theme";

const navTheme = createMuiTheme({
  ...baseTheme,
  palette: {
    ...(baseTheme.palette),
    secondary: yellow,
  }
})
const TitleLink = styled(Link)({
  flexGrow: 1,
});

interface Props {
  onClickMenu: () => any;
}
export function NavBar(props: Props) {
  const { onClickMenu } = props;
  const { isShuffling, setIsShuffling } = useAppStateContext();
  return (
    <ThemeProvider theme={navTheme}>
      <AppBar
        position="sticky"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onClickMenu}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit" component={TitleLink} to="/">
            Jaz Music Player
          </Button>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={isShuffling} onChange={() => {setIsShuffling(value => !value)}} aria-label="shuffle switch" />}
              label="Shuffle"
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}