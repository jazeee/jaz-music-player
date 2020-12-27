import { styled, Typography, useTheme } from "@material-ui/core";
import { ListChildComponentProps } from 'react-window';
import { ALL_KEY, useCategoryItemsContext } from "../CategoryItemsProvider";

const Wrapper = styled('div')({
  paddingLeft: 16,
  paddingRight: 16,
  cursor: 'pointer',
});

export function CategoryRow(props: ListChildComponentProps) {
  const { index, style } = props;
  const { selectedIndex, onSelectItem, availableItems } = useCategoryItemsContext();

  const { palette: { secondary } } = useTheme();
  const isSelected = index === selectedIndex;
  const item = availableItems[index];
  const backgroundColor = isSelected ? secondary.dark : undefined;

  return (
    <Wrapper style={{ ...style, backgroundColor }} onClick={() => { onSelectItem(item) }}>
      <Typography variant={isSelected ? "body1" : "body2"} noWrap color={isSelected ? 'textSecondary' : undefined}>
        {isSelected && <span>&gt; </span>}{item === ALL_KEY ? 'All' : item
      }</Typography>
    </Wrapper>
  )
}
