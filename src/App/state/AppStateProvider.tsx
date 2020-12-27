import constate from "constate";
import { useCallback } from "react";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorage";

type STATES = 'enabled' | 'disabled';

function getState(value: boolean): STATES {
  return value ? 'enabled' : 'disabled';
}

function getStateAsBoolean(value: STATES) {
  return value === 'enabled';
}

function useAppState() {
  const [shufflingState, setShufflingState] = useLocalStorageState<STATES>('shufflingState', 'disabled');

  const setIsShuffling = useCallback(function (valueOrFunction: boolean | ((prevState: boolean) => boolean)) {
    if (typeof valueOrFunction === 'function') {
      setShufflingState((currentValue: STATES) => {
        const newValue = valueOrFunction(getStateAsBoolean(currentValue));
        return getState(newValue);
      });
    } else {
      setShufflingState(getState(valueOrFunction));
    }
  }, [setShufflingState]);

  return {
    isShuffling: shufflingState === 'enabled',
    setIsShuffling,
  }
}

export const [AppStateProvider, useAppStateContext] = constate(useAppState);