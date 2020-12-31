import { FixedSizeList } from 'react-window';
import { useEffect, useState } from "react";
import { CategoryRow } from "./CategoryRow";
import { useCategoryItemsContext } from '../CategoryItemsProvider';
import { ROW_HEIGHT_IN_PX } from '../../constants';

interface Props {
  width: number;
  height: number;
}

export function CategoryItems(props: Props) {
  const { width, height } = props;
  const { selectedIndex, availableItems } = useCategoryItemsContext();
  const [listRef, setListRef] = useState<FixedSizeList>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // For some reason, scrolling needs to occur after a short while.
      listRef?.scrollToItem(selectedIndex);
    });
    return () => { clearTimeout(timeout) };
  }, [listRef, selectedIndex]);

  return (
    <FixedSizeList
      // @ts-ignore
      ref={setListRef}
      height={height}
      itemCount={availableItems.length}
      itemSize={ROW_HEIGHT_IN_PX}
      width={width}
    >
      {CategoryRow}
    </FixedSizeList>
  )
}