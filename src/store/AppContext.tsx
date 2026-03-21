import { createContext, useContext, type ReactNode } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useComparison } from '../hooks/useComparison';
import type { Movie } from '../types';

interface AppContextValue {
  favorites: Movie[];
  addFavorite: (m: Movie) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  comparison: Movie[];
  toggleComparison: (m: Movie) => void;
  inComparison: (id: number) => boolean;
  clearComparison: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const favs = useFavorites();
  const comp = useComparison();

  return (
    <AppContext.Provider value={{ ...favs, ...comp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext используется вне AppProvider');
  return ctx;
}
