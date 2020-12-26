import constate from "constate";
import { useSelectedIndices } from "../utils/hooks/useSelectedIndices";
import { musicData } from "./data/data";

function useSelectedMusic() {
  const { selectedIndices, setSelectedIndices } = useSelectedIndices();
  const music: Array<MusicDatum> = [];
  selectedIndices.forEach(index => music.push(musicData[index]));
  return { selectedIndices, setSelectedIndices, music, };
}

export const [SelectedMusicProvider, useSelectedMusicContext] = constate(useSelectedMusic);