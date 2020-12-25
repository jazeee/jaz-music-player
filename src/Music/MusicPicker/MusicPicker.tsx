import { Container, Grid } from "@material-ui/core";
import { musicData } from '../data/data';
import { useSelectedMusicContext } from "../../Layout/SelectedMusic";
import { MusicCard } from "./components/MusicCard";

// const someData:Array<MusicDatum> = [];
// for(let i = 0; i < 2000; i++) {
//   someData.push(musicData[i]);
// }
export function MusicPicker() {
  const { selectedIndices } = useSelectedMusicContext();
  const music:Array<MusicDatum> = [];
  selectedIndices.forEach(index => music.push(musicData[index]));
  return (
    <Container>
      <Grid container spacing={2}>
        {music.map(musicDatum =>
          <Grid item key={musicDatum.fileName} xs={12} sm={6}><MusicCard musicDatum={musicDatum} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}