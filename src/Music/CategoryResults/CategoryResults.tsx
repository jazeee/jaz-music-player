import { Box } from "@material-ui/core";
import { useElementSize } from "../../utils/hooks/useElementSize";
import { CategoryItems } from "./components/CategoryItems";

export function CategoryResults() {
  const { setElement, width, height } = useElementSize();
  return (
    <Box ref={setElement} sx={{ width: "100%", height: "100%" }}>
      <CategoryItems width={width} height={height}/>
    </Box>
  );
}