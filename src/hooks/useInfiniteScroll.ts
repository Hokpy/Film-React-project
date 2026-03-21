import { useEffect, useRef } from 'react';

// Хук бесконечного скролла через IntersectionObserver.
// hasMore и isLoading передаются через ref, чтобы observer не пересоздавался
// при каждом изменении состояния — только один observer на весь цикл жизни.
export function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  isLoading: boolean
): React.RefObject<HTMLDivElement> {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ hasMore, isLoading, onLoadMore });

  // Обновляем ref синхронно без пересоздания observer
  useEffect(() => {
    stateRef.current = { hasMore, isLoading, onLoadMore };
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          stateRef.current.hasMore &&
          !stateRef.current.isLoading
        ) {
          stateRef.current.onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    // disconnect вместо unobserve — чище при размонтировании
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return sentinelRef;
}
