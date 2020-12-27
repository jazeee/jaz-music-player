import { styled, Typography, useTheme } from "@material-ui/core";
import { useSelectedMusicContext } from "../../SelectedMusic";
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { ListChildComponentProps } from 'react-window';

const Wrapper = styled('div')({
  paddingLeft: 16,
  paddingRight: 16,
  cursor: 'pointer',
});

export function MusicCard(props: ListChildComponentProps) {
  const { index, style } = props;
  const { music } = useSelectedMusicContext();
  const { nowPlayingIndex, setNowPlayingIndex } = useMusicPlayerContext();
  const { description } = music[index];

  const { palette: { secondary } } = useTheme();
  const isCurrentlyPlaying = index === nowPlayingIndex;
  const backgroundColor = isCurrentlyPlaying ? secondary.dark : undefined;

  return (
    <Wrapper style={{ ...style, backgroundColor }} onClick={() => {setNowPlayingIndex(index)}}>
      <Typography variant="body1" noWrap>{description}</Typography>
    </Wrapper>
  )
}
