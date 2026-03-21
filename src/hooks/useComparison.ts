import { useState, useCallback, useRef, useEffect } from 'react';
import type { Movie } from '../types';

export function useComparison() {
  const [comparison, setComparison] = useState<Movie[]>([]);

  // Ref для стабильного inComparison без зависимости от массива
  const comparisonRef = useRef(comparison);
  useEffect(() => {
    comparisonRef.current = comparison;
  }, [comparison]);

  const toggleComparison = useCallback((movie: Movie) => {
    setComparison((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev.filter((m) => m.id !== movie.id);
      }
      // При выборе третьего — первый выталкивается (FIFO)
      if (prev.length >= 2) return [prev[1], movie];
      return [...prev, movie];
    });
  }, []);

  const inComparison = useCallback(
    (id: number) => comparisonRef.current.some((m) => m.id === id),
    []
  );

  const clearComparison = useCallback(() => setComparison([]), []);

  return { comparison, toggleComparison, inComparison, clearComparison };
}
