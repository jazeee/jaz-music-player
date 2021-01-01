import constate from 'constate';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelectedMusicContext } from '../SelectedMusic';
import { musicData } from '../data/data';
import { CategoryType } from '../data/categories';
import { useCategoryItemsContext } from '../CategoryResults/CategoryItemsProvider';
import { createMediaSource } from './mediaSource';

const MUSIC_PREFIX_URL = process.env.REACT_APP_MUSIC_SRC ?? '/data/music';

export enum PLAYER_STATE {
  UNSET = 'Unset',
  PAUSED = 'Paused',
  PLAYING = 'Playing',
}

export function useMusicPlayer({ categoryType }: {categoryType: CategoryType}) {
  const { selectedIndices } = useSelectedMusicContext();
  const { selectedCategoryItem } = useCategoryItemsContext();
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PLAYER_STATE>(PLAYER_STATE.UNSET);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState('');

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>();
  const [mediaSourceContainer, setMediaSourceContainer] = useState<MediaSourceContainer>();
  const playListMusicIndices = useMemo(() => {
    return [...selectedIndices];
  }, [selectedIndices]);
  const playListLength = playListMusicIndices?.length ?? 1;

  const currentMusicIndex = playListMusicIndices?.[nowPlayingIndex];

  const currentMusicDatum = musicData[currentMusicIndex];
  const currentFilePathSuffix = currentMusicDatum?.fileName;
  const currentFullFilePath = currentFilePathSuffix ? `${MUSIC_PREFIX_URL}/${currentFilePathSuffix}` : '';

  const nextMusicIndex = playListMusicIndices?.[(nowPlayingIndex + 1) % (playListLength)];
  const nextMusicDatum = musicData[nextMusicIndex];
  const nextFilePathSuffix = nextMusicDatum?.fileName;
  const nextFullFilePath = nextFilePathSuffix ? `${MUSIC_PREFIX_URL}/${nextFilePathSuffix}` : '';

  const updatePlayer = useCallback(function (newPlayerState: PLAYER_STATE) {
    if (!audioElement) {
      return;
    }
    audioElement.preload = 'auto';
    switch (newPlayerState) {
      case PLAYER_STATE.PLAYING:
        audioElement.play().catch((error) => {
          updatePlayer(PLAYER_STATE.PAUSED);
          console.error(error);
          setError(error.message);
        })
        break;
      case PLAYER_STATE.PAUSED:
        audioElement.pause()
        break;
      case PLAYER_STATE.UNSET:
        break;
      default:
        throw new Error(`Unexpected playerState: ${newPlayerState}`);
    }
  }, [audioElement]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [audioElement, volume]);

  useEffect(() => {
    updatePlayer(playerState);
  }, [updatePlayer, playerState])

  useEffect(() => {
    if (currentFullFilePath) {
      let cleanUp: () => void;
      createMediaSource(currentFullFilePath).then((mediaSourceContainer) => {
        setPlayerState(PLAYER_STATE.PAUSED);
        setMediaSourceContainer(mediaSourceContainer);
        const { bufferLatch, clearHead, abort } = mediaSourceContainer;
        bufferLatch.waitFor().then(() => {
          setPlayerState(playerState => {
            if (playerState !== PLAYER_STATE.UNSET) {
              playerState = currentFullFilePath ? PLAYER_STATE.PLAYING : PLAYER_STATE.PAUSED;
            }
            return playerState;
          });
        })
        let currentInterval = setInterval(() => clearHead(15), 20 * 1000);
        cleanUp = function() {
          abort();
          clearInterval(currentInterval);
        }
      })
      return () => {
        cleanUp?.();
      }
    }
  }, [currentFullFilePath]);

  useEffect(() => {
    setNowPlayingIndex(0);
    setPlayerState(playerState => {
      if (playerState !== PLAYER_STATE.PLAYING) {
        playerState = PLAYER_STATE.PLAYING;
      }
      if (!selectedCategoryItem) {
        playerState = PLAYER_STATE.PAUSED;
      }
      updatePlayer(playerState);
      return playerState;
    });
  }, [selectedCategoryItem, updatePlayer]);

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
    audioElement,
    mediaSourceContainer,
    setAudioElement,
    currentFullFilePath,
    currentMusicDatum,
    nextFullFilePath,
    nextMusicDatum,
    nowPlayingIndex,
    setNowPlayingIndex,
    playerState, setPlayerState,
    playListMusicIndices,
    isLoading, setIsLoading,
    currentTime, setCurrentTime,
    playbackTime, setPlaybackTime,
    volume, setVolume,
    goToPrevious,
    goToNext,
    error,
  }
}

export const [MusicPlayerProvider, useMusicPlayerContext] = constate(useMusicPlayer);