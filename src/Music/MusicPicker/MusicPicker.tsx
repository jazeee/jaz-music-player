import { Box, Paper, Table, TableBody, TableContainer } from "@material-ui/core";
import { MusicItems } from "./components/MusicItems";

export function MusicPicker() {
  return (
    <TableContainer component={Paper} style={{ height: '100%'}}>
      <Table aria-label="Music Table" size="small" style={{ height: '100%' }}>
        <TableBody>
          <Box sx={{width:"100%", height:"100%"}}>
            <MusicItems />
          </Box>
        </TableBody>
      </Table>
    </TableContainer>
  )
}