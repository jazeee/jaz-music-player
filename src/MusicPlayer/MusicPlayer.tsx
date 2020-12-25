import { Container, Grid, IconButton, LinearProgress, Slider, Typography } from "@material-ui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { musicData } from "../data/data";
import { useSelectedMusicContext } from "../Layout/SelectedMusic";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
// import StopIcon from '@material-ui/icons/Stop';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

const MUSIC_PREFIX_URL = process.env.REACT_APP_MUSIC_SRC ?? '/music';

enum PLAYER_STATE {
  UNSET = 'Unset',
  PAUSED = 'Paused',
  PLAYING = 'Playing',
}
// enum ORDER_STATE {
//   REPEAT_ALL = 'Repeat All',
//   SHUFFLE = 'Shuffle',
// }

export function MusicPlayer() {
  const { selectedIndices } =  useSelectedMusicContext();
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(PLAYER_STATE.UNSET);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [volume, setVolume] = useState(0.5);

  const ref = useRef<HTMLAudioElement | null>(null);
  const playIndices = [...selectedIndices];
  const playListLength = playIndices?.length ?? 1;
  const currentMusicIndex = playIndices?.[nowPlayingIndex];
  let previousMusicIndex = playIndices?.[(nowPlayingIndex - 1) % (playListLength)];
  if (previousMusicIndex < 0) {
    previousMusicIndex = playListLength - 1;
  }
  const nextMusicIndex = playIndices?.[(nowPlayingIndex + 1) % (playListLength)];
  const currentFilePathSuffix = musicData[currentMusicIndex]?.fileName;
  const currentFullFilePath = currentFilePathSuffix ? `${MUSIC_PREFIX_URL}/${currentFilePathSuffix}` : '';

  const updatePlayer = useCallback(function (playerState: PLAYER_STATE) {
    const el = ref.current;
    if (!el) {
      return;
    }
    switch (playerState) {
      case PLAYER_STATE.PLAYING:
        el.play().then(console.log).catch(console.error)
        break;
      case PLAYER_STATE.PAUSED:
        el.pause()
        break;
      case PLAYER_STATE.UNSET:
        break;
      default:
        throw new Error(`Unexpected playerState: ${playerState}`);
    }
  }, []);

  useEffect(() => {
    updatePlayer(playerState);
  }, [updatePlayer, playerState])

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    setPlayerState(playerState => {
      if (playerState === PLAYER_STATE.UNSET) {
        playerState = currentFullFilePath ? PLAYER_STATE.PLAYING: PLAYER_STATE.PAUSED;
      }
      updatePlayer(playerState);
      return playerState;
    });
  }, [currentFullFilePath, updatePlayer]);

  useEffect(() => {
    setNowPlayingIndex(0);
    setPlayerState(playerState => {
      if (!selectedIndices) {
        playerState = PLAYER_STATE.PAUSED;
      }
      if (playerState !== PLAYER_STATE.PLAYING) {
        playerState = PLAYER_STATE.PLAYING;
      }
      updatePlayer(playerState);
      return playerState;
    });
  }, [selectedIndices, updatePlayer]);

  function goToPrevious() {
    setNowPlayingIndex(index => {
      index -= 1;
      if (index < 0) {
        index = playListLength - 1
      }
      return index;
    })
  }

  function goToNext() {
    setNowPlayingIndex(index => { return (index + 1) % playListLength });
    setPlayerState(PLAYER_STATE.PLAYING);
  }

  return (
    <>
      <Container>
        {Boolean(currentFullFilePath) &&
          <audio ref={ref} src={currentFullFilePath} onEnded={goToNext} onWaiting={() => {setIsLoading(true)}} onPlaying={() => {setIsLoading(false)}} onTimeUpdate={() => {
            setPlaybackTime(ref.current?.duration ?? 0);
            setCurrentTime(ref.current?.currentTime ?? 0);
          }}
          onPlay={() => setPlayerState(PLAYER_STATE.PLAYING)}
          onPause={() => setPlayerState(PLAYER_STATE.PAUSED)}
          onVolumeChange={() => {
            if (ref.current){
              setVolume(ref.current.volume);
            }
          }}
          controls
          />
        }
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <IconButton onClick={goToPrevious}><SkipPreviousIcon /></IconButton>
                {playerState !== PLAYER_STATE.PLAYING ?
                  <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PLAYING) }}><PlayCircleFilledIcon /></IconButton> :
                  <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PAUSED) }}><PauseCircleFilledIcon /></IconButton>
                }
                <IconButton onClick={goToNext}><SkipNextIcon /></IconButton>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1">Progress</Typography>
                <Slider value={currentTime} max={playbackTime} onChange={(__event, time) => {
                  if (ref.current && playbackTime) {
                    time = Math.min(playbackTime, Math.max(0, time as number));
                    ref.current.currentTime = time;
                  }
                }}/>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1">Volume</Typography>
                <Slider value={volume} max={1.0} step={0.01} onChange={(__event, newVolume) => {
                  setVolume(newVolume as number)
                }}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Current: {currentFilePathSuffix}</Typography>
          </Grid>
          <Grid item xs={6} >
            <Typography variant="body2">Next Up: {musicData[nextMusicIndex]?.fileName}</Typography>
          </Grid>
        </Grid>
      </Container>
      {isLoading ?
        <LinearProgress />
        :
        <LinearProgress variant="determinate" value={currentTime > 0 && playbackTime > 0 ? (100 * currentTime / playbackTime) : 0} />
      }
    </>
  )
}