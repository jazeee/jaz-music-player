import constate from "constate";
import { useSelectedIndices } from "../utils/hooks/useSelectedIndices";

export const [SelectedMusicProvider, useSelectedMusicContext] = constate(useSelectedIndices);