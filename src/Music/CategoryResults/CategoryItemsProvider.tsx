import constate from "constate";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "../../utils/hooks/useQuery";
import { CategoryType } from "../data/categories";
import { ALL_BY_CATEGORY, ALL_INDICES, MUSIC_BY_CATEGORY } from "../data/data"
import { useSelectedMusicContext } from "../SelectedMusic";

export const ALL_KEY = 'ALL_OF_THEM!!!####UNIQUE####';

interface Props {
  category: CategoryType;
}

export function useCategoryItems(props: Props) {
  const { category } = props;
  const { param = ALL_KEY, setQueryParam } = useQuery('selectedCategories');
  const allByCategory = ALL_BY_CATEGORY[category];
  const { setSelectedIndices } = useSelectedMusicContext();
  const musicByCategory = MUSIC_BY_CATEGORY[category];
  const [selectedCategoryItem, setSelectedItem] = useState<string>(param);

  const availableItems = useMemo(() => [ALL_KEY, ...allByCategory], [allByCategory]);

  useEffect(() => {
    if (availableItems.includes(param)) {
      setSelectedItem(param);
    } else {
      setSelectedItem(ALL_KEY);
    }
  }, [param, availableItems]);

  useEffect(() => {
    if (category) {
      if (selectedCategoryItem === ALL_KEY) {
        setSelectedIndices(new Set(ALL_INDICES));
      } else {
        setSelectedIndices(new Set(musicByCategory[selectedCategoryItem]));
      }
    }
  }, [category, selectedCategoryItem, setSelectedIndices, musicByCategory]);

  const selectedIndex = useMemo(() => availableItems.findIndex((i: string) => i === selectedCategoryItem), [availableItems, selectedCategoryItem]);

  function onSelectItem(item: string) {
    setSelectedItem(item);
    setQueryParam(item);
  };

  return {
    selectedCategoryItem, setSelectedItem,
    selectedIndex,
    availableItems,
    onSelectItem,
  };
}

export const [CategoryItemsProvider, useCategoryItemsContext] = constate(useCategoryItems);