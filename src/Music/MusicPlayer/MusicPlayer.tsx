import { LinearProgress, Container, Grid, IconButton, Slider, styled, Typography } from "@material-ui/core";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeIcon from '@material-ui/icons/VolumeUpRounded';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { PLAYER_STATE, useMusicPlayerContext } from "./MusicPlayerProvider";
import React, { useState } from "react";
import { VolumeDialog } from "./components/VolumeDialog";

const MusicProgress = styled(Slider)({
  padding: "0 !important",
  height: "6px !important",
});

function formatSecondsToMinutes(timeInSeconds: number) {
  const minute = Math.floor(timeInSeconds / 60);
  const second = `${Math.floor(timeInSeconds % 60)}`.padStart(2, '0');
  return `${minute}:${second}`
}

export function MusicPlayer() {
  const {
    audioElement,
    setAudioElement,
    mediaSourceObjectUrl,
    currentFullFilePath,
    goToNext,
    goToPrevious,
    isLoading,
    setIsLoading,
    playbackTime,
    setPlaybackTime,
    currentMusicDatum,
    currentTime,
    setCurrentTime,
    playerState,
    setPlayerState,
    volume,
    setVolume,
  } = useMusicPlayerContext();
  const [volumeSelectIsVisible, setVolumeSelectIsVisible] = useState(false);
  const displayedTime = Number.isFinite(playbackTime) ? playbackTime : Number(currentMusicDatum.durationInSeconds);

  return (
    <>
      <Container>
        {Boolean(currentFullFilePath) &&
          <audio ref={setAudioElement} src={mediaSourceObjectUrl} onEnded={goToNext} onWaiting={() => { setIsLoading(true) }}
            onError={() => {setIsLoading(false)}}
            onPlaying={() => { setIsLoading(false) }}
            onTimeUpdate={() => {
              setPlaybackTime(audioElement?.duration ?? 0);
              setCurrentTime(audioElement?.currentTime ?? 0);
            }}
            onPlay={() => {
              if (audioElement) {
                audioElement.volume = volume
              }
              setPlayerState(PLAYER_STATE.PLAYING)
            }}
            onPause={() => setPlayerState(PLAYER_STATE.PAUSED)}
            onVolumeChange={() => {
              if (audioElement) {
                setVolume(audioElement.volume);
              }
            }}
          />
        }
      </Container>
      <Grid container spacing={0} alignItems="center">
        <Grid item xs>
          <Grid container spacing={0} justifyContent="center">
            <IconButton onClick={goToPrevious}><SkipPreviousIcon /></IconButton>
            {playerState !== PLAYER_STATE.PLAYING ?
              <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PLAYING) }}><PlayCircleFilledIcon /></IconButton> :
              <IconButton color="secondary" onClick={() => { setPlayerState(PLAYER_STATE.PAUSED) }}><PauseCircleFilledIcon /></IconButton>
            }
            <IconButton onClick={goToNext}><SkipNextIcon /></IconButton>
            <IconButton onClick={() => setVolumeSelectIsVisible(true)}><VolumeIcon /></IconButton>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          {Boolean(displayedTime) && (
            <>
              <Typography variant="body2" >
                {formatSecondsToMinutes(currentTime)} / {formatSecondsToMinutes(displayedTime)}
              </Typography>
            </>
          )}
          {isLoading && <LinearProgress />}
        </Grid>
      </Grid>
      <Container>
        <MusicProgress
          value={currentTime}
          max={displayedTime}
          onChange={(__event, time) => {
            if (audioElement && displayedTime) {
              time = Math.min(displayedTime, Math.max(0, time as number));
              audioElement.currentTime = time;
            }
          }} />
      </Container>
      {volumeSelectIsVisible && (
        <VolumeDialog setIsVisible={setVolumeSelectIsVisible} />
      )}
    </>
  )
}