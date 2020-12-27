import { SwipeableDrawer } from "@material-ui/core";
import { CategoryLinks } from "./CategoryLinks";

interface Props {
  menuIsOpen: boolean;
  setMenuIsOpen: (value: boolean) => any;
};

const anchor = 'left';

export function FilterSidebar(props: Props) {
  const { menuIsOpen, setMenuIsOpen } = props;
  return (
    <SwipeableDrawer anchor={anchor} open={menuIsOpen} onOpen={() => setMenuIsOpen(true)} onClose={() => setMenuIsOpen(false)}>
      <CategoryLinks onSelect={() => setMenuIsOpen(false)} />
    </SwipeableDrawer>
  );
}