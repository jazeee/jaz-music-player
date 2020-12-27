import { Box } from "@material-ui/core";
import { useElementSize } from "../../utils/hooks/useElementSize";
import { MusicItems } from "./components/MusicItems";

export function MusicPicker() {
  const { setElement, width, height } = useElementSize();

  return (
    <Box ref={setElement} sx={{width:"100%", height:"100%"}}>
      <MusicItems width={width} height={height}/>
    </Box>
  )
}