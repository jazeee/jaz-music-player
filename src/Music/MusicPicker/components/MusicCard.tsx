import { styled, Typography, useTheme } from "@material-ui/core";
import { useSelectedMusicContext } from "../../SelectedMusic";
import { useMusicPlayerContext } from "../../MusicPlayer/MusicPlayerProvider";
import { ListChildComponentProps } from 'react-window';
import { ROW_HEIGHT_IN_PX } from "../../constants";

const Wrapper = styled('div')({
  paddingLeft: 16,
  paddingRight: 16,
  cursor: 'pointer',
  lineHeight: ROW_HEIGHT_IN_PX,
});

const Text = styled(Typography)({
  lineHeight: `${ROW_HEIGHT_IN_PX}px`,
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
      <Text variant="body1" noWrap color={isCurrentlyPlaying ? 'textSecondary' : undefined}>{description}</Text>
    </Wrapper>
  )
}
