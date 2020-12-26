import { useSelectedMusicContext } from "../../SelectedMusic";
import { MusicCard } from "./MusicCard";
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { useEffect, useRef } from "react";

export function MusicItems() {
  const { music } = useSelectedMusicContext();
  const listRef = useRef<FixedSizeList>();
  const { nowPlayingIndex } = useMusicPlayerContext();

  useEffect(() => {
    listRef.current?.scrollToItem(nowPlayingIndex, 'center');
  }, [nowPlayingIndex]);
  return (
    <AutoSizer>
      {({ height, width }) => {
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
        );
      }}
    </AutoSizer>
  )
}