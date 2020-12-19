import { List, ListItem, ListItemText, SwipeableDrawer } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

interface Props {
  menuIsOpen: boolean;
  setMenuIsOpen: (value: boolean) => any;
};

const anchor = 'left';
const OPTIONS = [
  {
    title: 'All',
    path: '/',
  },
  {
    title: 'By Genre',
    path: '/genres',
  },
  {
    title: 'By Album',
    path: '/albums',
  },
  {
    title: 'By Artist',
    path: '/artists',
  },
];

export function FilterSidebar(props: Props) {
  const { menuIsOpen, setMenuIsOpen } = props;
  // Convert to `NavLink`
  const navigate = useNavigate();
  return (
    <SwipeableDrawer anchor={anchor} open={menuIsOpen} onOpen={() => setMenuIsOpen(true)} onClose={() => setMenuIsOpen(false)}>
      <List>
        {OPTIONS.map(({ title, path }) => (
          <ListItem button key={title} onClick={() => {
            setMenuIsOpen(false);
            navigate(path);
          }}>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
}