import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById } from '../api/movies';
import { useAppContext } from '../store/AppContext';
import { Modal } from '../components/Modal';
import { getRatingColor, formatRating } from '../utils/rating';
import type { Movie } from '../types';
import styles from './MovieDetailPage.module.css';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { isFavorite, addFavorite, removeFavorite, inComparison, toggleComparison } =
    useAppContext();

  useEffect(() => {
    if (!id) return;

    // Флаг для предотвращения обновления состояния после размонтирования
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setMovie(null);

    fetchMovieById(Number(id))
      .then((data) => { if (!cancelled) setMovie(data); })
      .catch(() => { if (!cancelled) setError('Не удалось загрузить фильм'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.errorState}>
        <p>{error ?? 'Фильм не найден'}</p>
        <button onClick={() => navigate(-1)}>← Назад</button>
      </div>
    );
  }

  const ratingRaw = movie.rating?.kp ?? movie.rating?.imdb;
  const rating = formatRating(ratingRaw);

  const handleFav = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.hero}>
        <div className={styles.posterWrap}>
          {movie.poster?.url ? (
            <img src={movie.poster.url} alt={movie.name} className={styles.poster} />
          ) : (
            <div className={styles.noPoster}>🎬</div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={`${styles.title} bebas`}>{movie.name}</h1>

          {movie.alternativeName && (
            <p className={styles.altName}>{movie.alternativeName}</p>
          )}

          <div className={styles.meta}>
            {movie.year != null && (
              <span className={styles.metaItem}>📅 {movie.year}</span>
            )}
            {rating && ratingRaw != null && (
              <span className={styles.metaItem} style={{ color: getRatingColor(ratingRaw) }}>
                ★ {rating}
              </span>
            )}
            {movie.movieLength != null && (
              <span className={styles.metaItem}>⏱ {movie.movieLength} мин</span>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className={styles.genres}>
              {movie.genres.map((g) => (
                <span key={g.name} className={styles.genre}>{g.name}</span>
              ))}
            </div>
          )}

          {(movie.description ?? movie.shortDescription) && (
            <p className={styles.description}>
              {movie.description ?? movie.shortDescription}
            </p>
          )}

          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${isFavorite(movie.id) ? styles.btnDanger : styles.btnPrimary}`}
              onClick={handleFav}
            >
              {isFavorite(movie.id) ? '❤️ В избранном' : '🤍 В избранное'}
            </button>
            <button
              className={`${styles.btn} ${inComparison(movie.id) ? styles.btnActive : styles.btnSecondary}`}
              onClick={() => toggleComparison(movie)}
            >
              {inComparison(movie.id) ? '⚖️ В сравнении' : '⚖️ Сравнить'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Добавить в избранное"
          message={`Добавить «${movie.name}» в список избранного?`}
          onConfirm={() => { addFavorite(movie); setShowModal(false); }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
