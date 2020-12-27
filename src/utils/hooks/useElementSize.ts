import { useCallback, useEffect, useState, useMemo } from "react";

export function useElementSize() {
  const [element, setElement] = useState<HTMLDivElement>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = useCallback(() => {
    if (element) {
      setWidth(element.clientWidth);
      setHeight(element.clientHeight);
    }
  }, [element]);

  const observer = useMemo(() =>
    // @ts-ignore
    new ResizeObserver(handleResize)
  , [handleResize]);

  useEffect(() => {
    if (element){
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    }
  }, [element, observer]);

  return {
    setElement,
    width, height
  };
}