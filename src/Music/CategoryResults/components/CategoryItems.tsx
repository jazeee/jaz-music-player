import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useEffect, useRef } from "react";
import { CategoryRow } from "./CategoryRow";
import { useCategoryItemsContext } from '../CategoryItemsProvider';

export function CategoryItems() {
  const { selectedIndex, availableItems } = useCategoryItemsContext();
  const listRef = useRef<FixedSizeList>();


  useEffect(() => {
    listRef.current?.scrollToItem(selectedIndex);
  }, [selectedIndex]);

  return (
    <AutoSizer>
      {({ height, width }) => {
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
        );
      }}
    </AutoSizer>
  )
}