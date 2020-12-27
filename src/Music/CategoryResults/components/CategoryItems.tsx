import { FixedSizeList } from 'react-window';
import { useEffect, useRef } from "react";
import { CategoryRow } from "./CategoryRow";
import { useCategoryItemsContext } from '../CategoryItemsProvider';

interface Props {
  width: number;
  height: number;
}

export function CategoryItems(props: Props) {
  const { width, height } = props;
  const { selectedIndex, availableItems } = useCategoryItemsContext();
  const listRef = useRef<FixedSizeList>();

  useEffect(() => {
    listRef.current?.scrollToItem(selectedIndex);
  }, [selectedIndex]);

  return (
    <FixedSizeList
      // @ts-ignore
      ref={listRef}
      height={height}
      itemCount={availableItems.length}
      itemSize={24}
      width={width}
    >
      {CategoryRow}
    </FixedSizeList>
  )
}