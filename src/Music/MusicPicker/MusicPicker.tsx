import { Box } from "@material-ui/core";
import { MusicItems } from "./components/MusicItems";

export function MusicPicker() {
  return (
    <Box sx={{width:"100%", height:"100%"}}>
      <MusicItems />
    </Box>
  )
}