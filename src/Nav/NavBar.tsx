import { AppBar, IconButton, Toolbar, Button } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";

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
        <Button color="inherit" component={Link} to="/">
          Jaz Music Player
        </Button>
      </Toolbar>
    </AppBar>
  )
}