import { List, ListItem, ListItemText, SwipeableDrawer } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { CategoryType, CATEGORY_PATHS } from "../Music/data/categories";

interface Props {
  menuIsOpen: boolean;
  setMenuIsOpen: (value: boolean) => any;
};

const anchor = 'left';

export function FilterSidebar(props: Props) {
  const { menuIsOpen, setMenuIsOpen } = props;
  // Convert to `NavLink`
  const navigate = useNavigate();
  return (
    <SwipeableDrawer anchor={anchor} open={menuIsOpen} onOpen={() => setMenuIsOpen(true)} onClose={() => setMenuIsOpen(false)}>
      <List>
        {Object.values(CategoryType).map((category) => {
          const path = `/music/${CATEGORY_PATHS[category]}`;
          return (
            <ListItem button key={category} onClick={() => {
              setMenuIsOpen(false);
              navigate(path);
            }}>
              <ListItemText primary={category} />
            </ListItem>
          );
        })}
      </List>
    </SwipeableDrawer>
  );
}