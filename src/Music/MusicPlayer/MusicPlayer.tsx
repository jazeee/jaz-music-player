import { Container, Grid, IconButton, LinearProgress, Slider, Typography } from "@material-ui/core";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
// import StopIcon from '@material-ui/icons/Stop';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { PLAYER_STATE, useMusicPlayerContext } from "./MusicPlayerProvider";

// enum ORDER_STATE {
//   REPEAT_ALL = 'Repeat All',
//   SHUFFLE = 'Shuffle',
// }

function formatSecondsToMinutes(timeInSeconds: number) {
  const minute = Math.floor(timeInSeconds / 60);
  const second = `${Math.floor(timeInSeconds % 60)}`.padStart(2, '0');
  return `${minute}:${second}`
}

export function MusicPlayer() {
  const {
    ref,
    currentFullFilePath,
    currentMusicDatum,
    nextFullFilePath,
    nextMusicDatum,
    goToNext,
    goToPrevious,
    setIsLoading,
    isLoading,
    playbackTime,
    setPlaybackTime,
    currentTime,
    setCurrentTime,
    playerState,
    setPlayerState,
    volume,
    setVolume,
  } = useMusicPlayerContext();

  return (
    <>
      <Container>
        {Boolean(currentFullFilePath) &&
          <audio ref={ref} src={currentFullFilePath} onEnded={goToNext} onWaiting={() => { setIsLoading(true) }} onPlaying={() => { setIsLoading(false) }} onTimeUpdate={() => {
            setPlaybackTime(ref.current?.duration ?? 0);
            setCurrentTime(ref.current?.currentTime ?? 0);
          }}
            onPlay={() => {
              if (ref.current) {
                ref.current.volume = volume
              }
              setPlayerState(PLAYER_STATE.PLAYING)
            }}
            onPause={() => setPlayerState(PLAYER_STATE.PAUSED)}
            onVolumeChange={() => {
              if (ref.current) {
                setVolume(ref.current.volume);
              }
            }}
          />
        }
        {Boolean(nextFullFilePath) &&
          // Cache next file
          <audio src={nextFullFilePath} />
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
                <Typography variant="body1">
                  Progress {Boolean(playbackTime) && <span>{formatSecondsToMinutes(currentTime)} / {formatSecondsToMinutes(playbackTime)}</span>}</Typography>
                <Slider value={currentTime} max={playbackTime} onChange={(__event, time) => {
                  if (ref.current && playbackTime) {
                    time = Math.min(playbackTime, Math.max(0, time as number));
                    ref.current.currentTime = time;
                  }
                }} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1">Volume</Typography>
                <Slider value={volume} max={1.0} step={0.01} onChange={(__event, newVolume) => {
                  setVolume(newVolume as number)
                }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Current: {currentMusicDatum?.description}</Typography>
          </Grid>
          <Grid item xs={6} >
            <Typography variant="body2">Next Up: {nextMusicDatum?.description}</Typography>
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