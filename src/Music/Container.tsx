import { styled } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { CategoryResults } from "../Music/CategoryResults/CategoryResults";
import { PATH_TO_CATEGORY } from "../Music/data/categories";
import { MusicPlayer } from "../Music/MusicPlayer/MusicPlayer";
import { CategoryItemsProvider } from "./CategoryResults/CategoryItemsProvider";
import { MusicPicker } from "./MusicPicker/MusicPicker";
import { MusicPlayerProvider } from "./MusicPlayer/MusicPlayerProvider";
import { SelectedMusicProvider } from "./SelectedMusic";

const PlayerPanel = styled('div')({
})

const CategoryPanel = styled('div')(({theme}) => ({
  flex: "1 0",
  // Flex doesn't shrink if element content size is bigger than shrunk size.
  // use minHeight to force flex to shrink.
  minHeight: 32,
  overflowY: 'unset',
}))

const Divider = styled('div')(({ theme }) => ({
  margin: '0 32px',
}));

const MusicPanel = styled('div')({
  flex: "1 0",
  // Flex doesn't shrink if element content size is bigger than shrunk size.
  // use minHeight to force flex to shrink.
  minHeight: 32,
  overflowY: 'unset',
})

export function MusicContainer() {
  const { category } = useParams();
  const categoryType = PATH_TO_CATEGORY[category];
  return (
    <>
      <SelectedMusicProvider>
        <CategoryItemsProvider category={categoryType}>
          <MusicPlayerProvider categoryType={categoryType}>
            <PlayerPanel>
              <MusicPlayer />
            </PlayerPanel>
            <CategoryPanel>
              <CategoryResults />
            </CategoryPanel>
            <Divider>
              <hr />
            </Divider>
            <MusicPanel>
              <MusicPicker />
            </MusicPanel>
          </MusicPlayerProvider>
        </CategoryItemsProvider>
      </SelectedMusicProvider>
    </>
  )
}