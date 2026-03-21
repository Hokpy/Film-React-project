import { useSearchParams } from 'react-router-dom';
import { GENRES, CURRENT_YEAR } from '../types';
import type { Filters } from '../types';
import styles from './FiltersPanel.module.css';

export const DEFAULT_FILTERS: Filters = {
  genres: [],
  ratingMin: 0,
  ratingMax: 10,
  yearMin: 1990,
  yearMax: CURRENT_YEAR,
};

// Парсим фильтры из URLSearchParams
export function filtersFromParams(params: URLSearchParams): Filters {
  return {
    genres: params.getAll('genre'),
    ratingMin: Number(params.get('ratingMin') ?? DEFAULT_FILTERS.ratingMin),
    ratingMax: Number(params.get('ratingMax') ?? DEFAULT_FILTERS.ratingMax),
    yearMin: Number(params.get('yearMin') ?? DEFAULT_FILTERS.yearMin),
    yearMax: Number(params.get('yearMax') ?? DEFAULT_FILTERS.yearMax),
  };
}

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function FiltersPanel({ isOpen = false, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersFromParams(searchParams);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      return next;
    });
  };

  // Мультиселект жанров через повторяющийся URL-параметр genre=...
  const toggleGenre = (genre: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = next.getAll('genre');
      next.delete('genre');
      const updated = current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre];
      updated.forEach((g) => next.append('genre', g));
      return next;
    });
  };

  // Валидация диапазона при потере фокуса — min не может быть > max
  const clampRatingMin = (val: number) => {
    const clamped = Math.min(val, filters.ratingMax);
    setParam('ratingMin', String(Math.max(0, clamped)));
  };
  const clampRatingMax = (val: number) => {
    const clamped = Math.max(val, filters.ratingMin);
    setParam('ratingMax', String(Math.min(10, clamped)));
  };
  const clampYearMin = (val: number) => {
    const clamped = Math.min(val, filters.yearMax);
    setParam('yearMin', String(Math.max(1990, clamped)));
  };
  const clampYearMax = (val: number) => {
    const clamped = Math.max(val, filters.yearMin);
    setParam('yearMax', String(Math.min(CURRENT_YEAR, clamped)));
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.ratingMin !== DEFAULT_FILTERS.ratingMin ||
    filters.ratingMax !== DEFAULT_FILTERS.ratingMax ||
    filters.yearMin !== DEFAULT_FILTERS.yearMin ||
    filters.yearMax !== DEFAULT_FILTERS.yearMax;

  const panelClass = [styles.panel, isOpen ? styles.mobileOpen : ''].filter(Boolean).join(' ');

  return (
    <aside className={panelClass}>
      <div className={styles.header}>
        <h2 className={`${styles.heading} bebas`}>Фильтры</h2>
        <div className={styles.headerActions}>
          {hasActiveFilters && (
            <button className={styles.reset} onClick={() => setSearchParams({})}>
              Сбросить
            </button>
          )}
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          )}
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Жанры</h3>
        <div className={styles.genreGrid}>
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`${styles.genreTag} ${filters.genres.includes(genre) ? styles.genreActive : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Рейтинг КП</h3>
        <div className={styles.rangeRow}>
          <label className={styles.rangeLabel}>
            от
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={filters.ratingMin}
              className={styles.rangeInput}
              onChange={(e) => setParam('ratingMin', e.target.value)}
              onBlur={(e) => clampRatingMin(Number(e.target.value))}
            />
          </label>
          <span className={styles.rangeSep}>—</span>
          <label className={styles.rangeLabel}>
            до
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={filters.ratingMax}
              className={styles.rangeInput}
              onChange={(e) => setParam('ratingMax', e.target.value)}
              onBlur={(e) => clampRatingMax(Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Год выпуска</h3>
        <div className={styles.rangeRow}>
          <label className={styles.rangeLabel}>
            от
            <input
              type="number"
              min={1990}
              max={CURRENT_YEAR}
              value={filters.yearMin}
              className={styles.rangeInput}
              onChange={(e) => setParam('yearMin', e.target.value)}
              onBlur={(e) => clampYearMin(Number(e.target.value))}
            />
          </label>
          <span className={styles.rangeSep}>—</span>
          <label className={styles.rangeLabel}>
            до
            <input
              type="number"
              min={1990}
              max={CURRENT_YEAR}
              value={filters.yearMax}
              className={styles.rangeInput}
              onChange={(e) => setParam('yearMax', e.target.value)}
              onBlur={(e) => clampYearMax(Number(e.target.value))}
            />
          </label>
        </div>
      </section>

      {onClose && (
        <button className={styles.applyBtn} onClick={onClose}>
          Применить
        </button>
      )}
    </aside>
  );
}
