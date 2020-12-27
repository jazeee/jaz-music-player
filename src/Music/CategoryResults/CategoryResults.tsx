import { Box } from "@material-ui/core";
import { CategoryItems } from "./components/CategoryItems";

export function CategoryResults() {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <CategoryItems />
    </Box>
  );
}