import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

interface Props {
  onClickMenu: () => any;
}
export function NavBar(props: Props) {
  const { onClickMenu } = props;
  return (
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
        <Typography variant="h6" noWrap>
          Jaz Music Player
        </Typography>
      </Toolbar>
    </AppBar>
  )
}