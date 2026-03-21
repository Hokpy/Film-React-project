import type { RefObject } from 'react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../types';
import styles from './MovieGrid.module.css';

interface Props {
  movies: Movie[];
  isLoading: boolean;
  sentinelRef: RefObject<HTMLDivElement>;
}

function Skeletons() {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={styles.skeleton}>
          <div className={styles.skPoster} />
          <div className={styles.skInfo}>
            <div className={styles.skLine} />
            <div className={`${styles.skLine} ${styles.skLineShort}`} />
          </div>
        </div>
      ))}
    </>
  );
}

export function MovieGrid({ movies, isLoading, sentinelRef }: Props) {
  if (!isLoading && movies.length === 0) {
    return (
      <div className={styles.empty}>
        <span>🎬</span>
        <p>Фильмы не найдены</p>
        <span className={styles.emptySub}>Попробуйте изменить фильтры</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {isLoading && <Skeletons />}
      </div>
      {/* Маркер для IntersectionObserver — триггер подгрузки */}
      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  );
}
