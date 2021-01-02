import constate from "constate";
import { useEffect, useMemo, useState } from "react";
import { useAppStateContext } from "../../App/state/AppStateProvider";
import { shuffle } from "../../utils/arrays";
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
  const { isShuffling } = useAppStateContext();
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
    let newSelectedIndices: Array<number>;
    if (category) {
      if (selectedCategoryItem === ALL_KEY) {
        newSelectedIndices = ALL_INDICES;
      } else {
        newSelectedIndices = musicByCategory[selectedCategoryItem];
      }
      newSelectedIndices = [...(newSelectedIndices ?? [])];
      if (isShuffling) {
        shuffle(newSelectedIndices);
      }
      setSelectedIndices([...new Set(newSelectedIndices)]);
    }
  }, [category, selectedCategoryItem, setSelectedIndices, musicByCategory, isShuffling]);

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