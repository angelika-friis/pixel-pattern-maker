import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { PreviewBounds } from '../domain/pixelGrid';

export function useResizeObserver<TElement extends Element>(
  ref: RefObject<TElement | null>,
): PreviewBounds {
  const [bounds, setBounds] = useState<PreviewBounds>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return bounds;
}
