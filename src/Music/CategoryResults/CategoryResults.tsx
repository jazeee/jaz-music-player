import { Table, TableContainer, TableBody, TableCell, Paper, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { SelectableTableRow } from "../../lib/components/SelectedTableRow";
import { CategoryType } from "../data/categories";
import { ALL_BY_CATEGORY, ALL_INDICES, MUSIC_BY_CATEGORY } from "../data/data"
import { useSelectedMusicContext } from "../SelectedMusic";

interface Props {
  category: CategoryType;
}

const ALL_KEY = 'ALL_OF_THEM!!!####UNIQUE####';

export function CategoryResults(props: Props) {
  const { category } = props;
  const allByCategory = ALL_BY_CATEGORY[category];
  const { setSelectedIndices } = useSelectedMusicContext();
  const musicByCategory = MUSIC_BY_CATEGORY[category];
  const [selectedItem, setSelectedItem] = useState<string>();
  useEffect(() => {
    if (category) {
      setSelectedItem(ALL_KEY);
      setSelectedIndices(new Set(ALL_INDICES));
    }
  }, [category, setSelectedIndices]);

  function onClick(item: string) {
    setSelectedItem(item);
    if (item === ALL_KEY) {
      setSelectedIndices(new Set(ALL_INDICES));
    } else {
      setSelectedIndices(new Set(musicByCategory[item]));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableBody>
          {[ALL_KEY, ...allByCategory].map((item) => {
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