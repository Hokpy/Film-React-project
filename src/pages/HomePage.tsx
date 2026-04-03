import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchMovies } from '../api/movies'
import { FiltersPanel, filtersFromParams } from '../components/FiltersPanel'
import { MovieGrid } from '../components/MovieGrid'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import type { Movie } from '../types'
import styles from './HomePage.module.css'

export function HomePage() {
  const [searchParams] = useSearchParams()
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Мемоизируем фильтры — объект не пересоздаётся без нужды
  const filtersKey = searchParams.toString()
  const filters = useMemo(() => filtersFromParams(searchParams), [filtersKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Сброс при смене фильтров
  const prevFiltersKey = useRef(filtersKey)
  useEffect(() => {
    if (prevFiltersKey.current === filtersKey) return
    prevFiltersKey.current = filtersKey
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [filtersKey])

  const loadMovies = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchMovies(page, filters)
      setMovies((prev) => {
        // Дедупликация — защита от двойного вызова React StrictMode
        const seen = new Set(prev.map((m) => m.id))
        return [...prev, ...data.docs.filter((m) => !seen.has(m.id))]
      })
      setHasMore(data.page < data.pages)
      setPage((p) => p + 1)
    } catch {
      setError(
        'Не удалось загрузить фильмы. Проверьте VITE_KINOPOISK_API_KEY в .env',
      )
    } finally {
      setIsLoading(false)
    }
  }, [page, filters, isLoading, hasMore])

  // Первичная загрузка и перезагрузка после сброса фильтров
  useEffect(() => {
    if (movies.length === 0 && hasMore && !isLoading) {
      loadMovies()
    }
  }, [filtersKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const sentinelRef = useInfiniteScroll(loadMovies, hasMore, isLoading)

  return (
    <div className={styles.page}>
      <button
        className={styles.filterToggle}
        onClick={() => setFiltersOpen(true)}
      >
        ⚙️ Фильтры
      </button>

      <div className={styles.layout}>
        <FiltersPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <div className={styles.content}>
          {error && <div className={styles.error}>⚠️ {error}</div>}
          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            sentinelRef={sentinelRef}
          />
        </div>
      </div>

      {filtersOpen && (
        <div
          className={styles.overlay}
          onClick={() => setFiltersOpen(false)}
        />
      )}
    </div>
  )
}
