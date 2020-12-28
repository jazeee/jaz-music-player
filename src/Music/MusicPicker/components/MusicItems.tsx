import { useSelectedMusicContext } from "../../SelectedMusic";
import { MusicCard } from "./MusicCard";
import { FixedSizeList } from 'react-window';
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { useEffect, useRef } from "react";
import { ROW_HEIGHT_IN_PX } from "../../constants";

interface Props {
  width: number;
  height: number;
}

export function MusicItems(props: Props) {
  const { width, height } = props;
  const { music } = useSelectedMusicContext();
  const listRef = useRef<FixedSizeList>();
  const { nowPlayingIndex } = useMusicPlayerContext();

  useEffect(() => {
    listRef.current?.scrollToItem(nowPlayingIndex);
  }, [nowPlayingIndex]);
  return (
    <FixedSizeList
      // @ts-ignore
      ref={listRef}
      height={height}
      itemCount={music.length}
      itemSize={ROW_HEIGHT_IN_PX}
      width={width}
    >
      {MusicCard}
    </FixedSizeList>
  )
}