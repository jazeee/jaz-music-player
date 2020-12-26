import constate from 'constate';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelectedMusicContext } from '../SelectedMusic';
import { musicData } from '../data/data';
import { CategoryType } from '../data/categories';

const MUSIC_PREFIX_URL = process.env.REACT_APP_MUSIC_SRC ?? '/music';

export enum PLAYER_STATE {
  UNSET = 'Unset',
  PAUSED = 'Paused',
  PLAYING = 'Playing',
}

export function useMusicPlayer({ categoryType }: {categoryType: CategoryType}) {
  const { selectedIndices } = useSelectedMusicContext();
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(PLAYER_STATE.UNSET);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [volume, setVolume] = useState(0.5);

  const ref = useRef<HTMLAudioElement | null>(null);
  const el = ref.current;
  const playIndices = [...selectedIndices];
  const playListLength = playIndices?.length ?? 1;
  const currentMusicIndex = playIndices?.[nowPlayingIndex];
  let previousMusicIndex = playIndices?.[(nowPlayingIndex - 1) % (playListLength)];
  if (previousMusicIndex < 0) {
    previousMusicIndex = playListLength - 1;
  }
  const currentFilePathSuffix = musicData[currentMusicIndex]?.fileName;
  const currentFullFilePath = currentFilePathSuffix ? `${MUSIC_PREFIX_URL}/${currentFilePathSuffix}` : '';
  const nextMusicIndex = playIndices?.[(nowPlayingIndex + 1) % (playListLength)];
  const nextFilePathSuffix = musicData[nextMusicIndex]?.fileName;
  const nextFullFilePath = nextFilePathSuffix ? `${MUSIC_PREFIX_URL}/${nextFilePathSuffix}` : '';

  const updatePlayer = useCallback(function (newPlayerState: PLAYER_STATE) {
    if (!el) {
      return;
    }
    switch (newPlayerState) {
      case PLAYER_STATE.PLAYING:
        el.play().catch(console.error)
        break;
      case PLAYER_STATE.PAUSED:
        el.pause()
        break;
      case PLAYER_STATE.UNSET:
        break;
      default:
        throw new Error(`Unexpected playerState: ${newPlayerState}`);
    }
  }, [el]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [el, volume]);

  useEffect(() => {
    updatePlayer(playerState);
  }, [updatePlayer, playerState])

  useEffect(() => {
    setPlayerState(playerState => {
      if (playerState !== PLAYER_STATE.UNSET) {
        playerState = currentFullFilePath ? PLAYER_STATE.PLAYING : PLAYER_STATE.PAUSED;
      }
      updatePlayer(playerState);
      return playerState;
    });
  }, [currentFullFilePath, updatePlayer]);

  useEffect(() => {
    setNowPlayingIndex(0);
    setPlayerState(playerState => {
      if (playerState !== PLAYER_STATE.PLAYING) {
        playerState = PLAYER_STATE.PLAYING;
      }
      if (!categoryType) {
        playerState = PLAYER_STATE.PAUSED;
      }
      updatePlayer(playerState);
      return playerState;
    });
  }, [categoryType, updatePlayer]);

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

  return {
    ref,
    currentFullFilePath,
    currentFilePathSuffix,
    nextFilePathSuffix,
    nextFullFilePath,
    nowPlayingIndex,
    setNowPlayingIndex,
    playerState, setPlayerState,
    isLoading, setIsLoading,
    currentTime, setCurrentTime,
    playbackTime, setPlaybackTime,
    volume, setVolume,
    goToPrevious,
    goToNext,
  }
}

export const [MusicPlayerProvider, useMusicPlayerContext] = constate(useMusicPlayer);