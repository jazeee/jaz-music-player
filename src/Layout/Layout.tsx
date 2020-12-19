import { styled } from "@material-ui/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { CategoryResults } from "../CategoryResults/CategoryResults";
import { CategoryType } from "../data/categories";
import { FilterSidebar } from "../FilterSidebar/FilterSidebar";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import { NavBar } from "../Nav/NavBar";
import { SelectedMusicProvider } from "./SelectedMusic";

const AppContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

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

export function Layout() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <FilterSidebar menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}/>
      <AppContainer>
        <NavBar onClickMenu={() => setMenuIsOpen(value => !value)}/>
        <SelectedMusicProvider>
          <PlayerPanel>
            <MusicPlayer />
          </PlayerPanel>
          <CategoryPanel>
            <CategoryResults category={CategoryType.ALBUM} />
          </CategoryPanel>
          <MusicPanel>
            <Outlet />
          </MusicPanel>
        </SelectedMusicProvider>
      </AppContainer>
    </>
  )
}