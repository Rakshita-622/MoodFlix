import { useState, useEffect, useRef, useCallback } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useMeasure<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  Size,
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    // Initial measure
    const { width, height } = element.getBoundingClientRect();
    setSize({ width, height });

    return () => observer.disconnect();
  }, [handleResize]);

  return [ref, size];
}
