import { useState } from 'react';

export function useSelectedIndices() {
  const [selectedIndices, setSelectedIndices] = useState<Array<number>>([]);

  function clearIndices(): void {
    setSelectedIndices([]);
  }

  function addIndex(index: number): void {
    setSelectedIndices(current => [...new Set(current).add(index)]);
  };

  function removeIndex(index: number): void {
    setSelectedIndices(current => {
      const set = new Set(current);
      set.delete(index);
      return [...set];
    });
  };

  function toggleIndex(index: number): void {
    setSelectedIndices(current => {
      const set = new Set(current);
      if (set.has(index)) {
        set.delete(index);
      } else {
        set.add(index);
      }
      return [...set];
    });
  };

  return {
    selectedIndices,
    setSelectedIndices,
    clearIndices,
    addIndex,
    removeIndex,
    toggleIndex,
  }
}
