import { useSelectedMusicContext } from "../../SelectedMusic";
import { MusicCard } from "./MusicCard";
import { FixedSizeList } from 'react-window';
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { useEffect, useRef } from "react";

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
      itemSize={24}
      width={width}
    >
      {MusicCard}
    </FixedSizeList>
  )
}