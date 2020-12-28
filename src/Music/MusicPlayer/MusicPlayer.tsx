import { Container, Grid, IconButton, LinearProgress, Slider, Typography } from "@material-ui/core";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeIcon from '@material-ui/icons/VolumeUpRounded';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { PLAYER_STATE, useMusicPlayerContext } from "./MusicPlayerProvider";
import React, { useState } from "react";
import { VolumeDialog } from "./components/VolumeDialog";

function formatSecondsToMinutes(timeInSeconds: number) {
  const minute = Math.floor(timeInSeconds / 60);
  const second = `${Math.floor(timeInSeconds % 60)}`.padStart(2, '0');
  return `${minute}:${second}`
}

export function MusicPlayer() {
  const {
    ref,
    currentFullFilePath,
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
  const [volumeSelectIsVisible, setVolumeSelectIsVisible] = useState(false);

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
      </Container>
      <Grid container spacing={0} justifyContent="space-around">
        <Grid item xs={8}>
          <IconButton onClick={goToPrevious}><SkipPreviousIcon /></IconButton>
          {playerState !== PLAYER_STATE.PLAYING ?
            <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PLAYING) }}><PlayCircleFilledIcon /></IconButton> :
            <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PAUSED) }}><PauseCircleFilledIcon /></IconButton>
          }
          <IconButton onClick={goToNext}><SkipNextIcon /></IconButton>
          <IconButton onClick={() => setVolumeSelectIsVisible(true)}><VolumeIcon /></IconButton>
        </Grid>
        <Grid item xs={4}>
          {Boolean(playbackTime) && (
            <>
              <Typography variant="body2" >
                {formatSecondsToMinutes(currentTime)} / {formatSecondsToMinutes(playbackTime)}
              </Typography>
              <Slider
                value={currentTime}
                max={playbackTime}
                onChange={(__event, time) => {
                if (ref.current && playbackTime) {
                  time = Math.min(playbackTime, Math.max(0, time as number));
                  ref.current.currentTime = time;
                }
              }} />
            </>
          )}
        </Grid>
      </Grid>
      {volumeSelectIsVisible && (
        <VolumeDialog setIsVisible={setVolumeSelectIsVisible} />
      )}
      {isLoading ?
        <LinearProgress />
        :
        <LinearProgress variant="determinate" value={currentTime > 0 && playbackTime > 0 ? (100 * currentTime / playbackTime) : 0} />
      }
    </>
  )
}