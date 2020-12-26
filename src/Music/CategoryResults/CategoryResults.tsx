import { Table, TableContainer, TableBody, TableCell, Paper, Typography, Box } from "@material-ui/core";
import { SelectableTableRow } from "../../lib/components/SelectedTableRow";
import { CategoryType } from "../data/categories";
import { ALL_KEY, CategoryItemsProvider, useCategoryItemsContext } from "./CategoryItemsProvider";
import { CategoryItems } from "./components/CategoryItems";

interface Props {
  category: CategoryType;
}

function Internal() {
  const { availableItems, selectedItem, onSelectItem} = useCategoryItemsContext();
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
              <SelectableTableRow key={item} onClick={() => { onSelectItem(item); }} selected={isSelected}>
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
  )
}

export function CategoryResults(props: Props) {
  const { category } = props;

  return (
    <CategoryItemsProvider category={category}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <CategoryItems />
      </Box>
    </CategoryItemsProvider>
  );
}