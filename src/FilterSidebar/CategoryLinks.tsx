import { List, ListItem, ListItemText, styled } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { CategoryType, CATEGORY_PATHS } from "../Music/data/categories";

const ActiveNavLink = styled(NavLink)(({theme}) => ({
  "&.active": {
    backgroundColor: theme.palette.primary.main,
  }
}));

interface Props {
  onSelect?: () => any;
}

export function CategoryLinks(props: Props) {
  return (
    <List>
      {Object.values(CategoryType).map((category) => {
        const path = `/music/${CATEGORY_PATHS[category]}`;
        return (
          <ListItem button key={category} component={ActiveNavLink} to={path} onClick={() => props.onSelect?.()}>
            <ListItemText primary={category} />
          </ListItem>
        );
      })}
    </List>
  )
}