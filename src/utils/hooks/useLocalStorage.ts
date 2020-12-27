import { Dispatch, SetStateAction, useCallback, useState } from "react";

function getLocalStorage<T>(key: string): T | undefined {
  try {
    const value = localStorage?.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return;
  } catch {
    return;
  }
}

function setLocalStorage<T>(key: string, value: T | null) {
  try {
    if (value == null) {
      localStorage?.removeItem(key);
    }
    localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function useLocalStorageState<T extends string | number>(paramName: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setStateValue] = useState<T>(getLocalStorage<T>(paramName) ?? initialValue);

  const setValue = useCallback(function(valueOrFunction: T | ((prevState: T) => T)) {
    if (typeof valueOrFunction === 'function') {
      setStateValue((currentValue: T) => {
        const newValue = valueOrFunction(currentValue);
        setLocalStorage<T>(paramName, newValue);
        return newValue;
      });
    } else {
      setLocalStorage<T>(paramName, valueOrFunction);
      setStateValue(valueOrFunction);
    }
  }, [paramName]);

  return [value, setValue as Dispatch<SetStateAction<T>>];
}
