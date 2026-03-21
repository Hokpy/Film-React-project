import { useState, useCallback, useRef, useEffect } from 'react';
import type { Movie } from '../types';

const STORAGE_KEY = 'cinescope_favorites';

function loadFromStorage(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(loadFromStorage);

  // Ref для isFavorite — стабильный колбэк без перерендера подписчиков
  const favoritesRef = useRef(favorites);
  useEffect(() => {
    favoritesRef.current = favorites;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Стабильная ссылка — читает из ref, не зависит от состояния
  const isFavorite = useCallback((id: number) => favoritesRef.current.some((m) => m.id === id), []);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
