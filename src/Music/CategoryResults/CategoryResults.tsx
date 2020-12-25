import { Table, TableContainer, TableBody, TableRow, TableCell, Paper, styled } from "@material-ui/core";
import { CategoryType } from "../data/categories";
import { ALL_BY_CATEGORY, ALL_INDICES, MUSIC_BY_CATEGORY } from "../data/data"
import { useSelectedMusicContext } from "../SelectedMusic";

const SelectableTableRow = styled(TableRow)({
  cursor: 'pointer',
});

interface Props {
  category: CategoryType;
}

export function CategoryResults(props: Props) {
  const { category } = props;
  const allByCategory = ALL_BY_CATEGORY[category];
  const { setSelectedIndices } = useSelectedMusicContext();
  const musicByCategory = MUSIC_BY_CATEGORY[category];
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          <SelectableTableRow onClick={() => { setSelectedIndices(new Set(ALL_INDICES))}}>
            <TableCell>All</TableCell>
          </SelectableTableRow>
          {allByCategory.map((item) => (
            <SelectableTableRow key={item} onClick={() => { setSelectedIndices(new Set(musicByCategory[item]))}}>
              <TableCell>
                {item}
              </TableCell>
            </SelectableTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>  )
}