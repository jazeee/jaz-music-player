import { styled } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { CategoryResults } from "../Music/CategoryResults/CategoryResults";
import { PATH_TO_CATEGORY } from "../Music/data/categories";
import { MusicPlayer } from "../Music/MusicPlayer/MusicPlayer";
import { MusicPicker } from "./MusicPicker/MusicPicker";
import { MusicPlayerProvider } from "./MusicPlayer/MusicPlayerProvider";
import { SelectedMusicProvider } from "./SelectedMusic";

const PlayerPanel = styled('div')({
})

const CategoryPanel = styled('div')({
  minHeight: 240,
  maxHeight: 480,
  overflowY: 'auto',
})

const MusicPanel = styled('div')({
  flex: 'auto',
  overflowY: 'auto',
})

export function MusicContainer() {
  const { category } = useParams();
  const categoryType = PATH_TO_CATEGORY[category];
  return (
    <>
      <SelectedMusicProvider>
        <MusicPlayerProvider>
          <PlayerPanel>
            <MusicPlayer />
          </PlayerPanel>
          <CategoryPanel>
            <CategoryResults category={categoryType} />
          </CategoryPanel>
          <MusicPanel>
            <MusicPicker />
          </MusicPanel>
        </MusicPlayerProvider>
      </SelectedMusicProvider>
    </>
  )
}