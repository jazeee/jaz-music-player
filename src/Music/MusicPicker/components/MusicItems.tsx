import { useSelectedMusicContext } from "../../SelectedMusic";
import { MusicCard } from "./MusicCard";
import { FixedSizeList } from 'react-window';
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { useEffect, useState } from "react";
import { ROW_HEIGHT_IN_PX } from "../../constants";

interface Props {
  width: number;
  height: number;
}

export function MusicItems(props: Props) {
  const { width, height } = props;
  const { selectedIndices } = useSelectedMusicContext();
  const [listRef, setListRef] = useState<FixedSizeList>();
  const { nowPlayingIndex } = useMusicPlayerContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // For some reason, scrolling needs to occur after a short while.
      listRef?.scrollToItem(nowPlayingIndex);
    });
    return () => {clearTimeout(timeout)};
  }, [listRef, nowPlayingIndex]);
  return (
    <FixedSizeList
      // @ts-ignore
      ref={setListRef}
      height={height}
      itemCount={selectedIndices.length}
      itemSize={ROW_HEIGHT_IN_PX}
      width={width}
    >
      {MusicCard}
    </FixedSizeList>
  )
}