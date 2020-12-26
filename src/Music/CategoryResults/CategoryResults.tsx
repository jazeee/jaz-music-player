import { Table, TableContainer, TableBody, TableCell, Paper, Typography } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { SelectableTableRow } from "../../lib/components/SelectedTableRow";
import { useQuery } from "../../utils/hooks/useQuery";
import { CategoryType } from "../data/categories";
import { ALL_BY_CATEGORY, ALL_INDICES, MUSIC_BY_CATEGORY } from "../data/data"
import { useSelectedMusicContext } from "../SelectedMusic";

interface Props {
  category: CategoryType;
}

const ALL_KEY = 'ALL_OF_THEM!!!####UNIQUE####';

export function CategoryResults(props: Props) {
  const { category } = props;
  const { param = ALL_KEY, setQueryParam } = useQuery('selectedCategories');
  const allByCategory = ALL_BY_CATEGORY[category];
  const { setSelectedIndices } = useSelectedMusicContext();
  const musicByCategory = MUSIC_BY_CATEGORY[category];
  const [selectedItem, setSelectedItem] = useState<string>(param);

  const availableItems = useMemo(() => [ALL_KEY, ...allByCategory], [allByCategory]);

  useEffect(() => {
    if (availableItems.includes(param)) {
      setSelectedItem(param);
    }
  }, [param, availableItems]);

  useEffect(() => {
    if (category) {
      if (selectedItem === ALL_KEY) {
        setSelectedIndices(new Set(ALL_INDICES));
      } else {
        setSelectedIndices(new Set(musicByCategory[selectedItem]));
      }
    }
  }, [category, selectedItem, setSelectedIndices, musicByCategory]);

  function onClick(item: string) {
    setSelectedItem(item);
    setQueryParam(item);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableBody>
          {availableItems.map((item) => {
            let text = item;
            if (item === ALL_KEY) {
              text = 'All';
            }
            const isSelected = selectedItem === item;
            return (
              <SelectableTableRow key={item} onClick={() => {onClick(item);}} selected={isSelected}>
                <TableCell>
                  <Typography variant={isSelected ? "body1" : "body2"}>
                    {isSelected && <span>&gt; </span>}
                    {text}
                  </Typography>
                </TableCell>
              </SelectableTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}