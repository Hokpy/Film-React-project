import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { Modal } from './Modal';
import { getRatingColor, formatRating } from '../utils/rating';
import type { Movie } from '../types';
import styles from './MovieCard.module.css';

interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  const { isFavorite, addFavorite, removeFavorite, inComparison, toggleComparison } =
    useAppContext();
  const [showModal, setShowModal] = useState(false);

  const ratingRaw = movie.rating?.kp ?? movie.rating?.imdb;
  const rating = formatRating(ratingRaw);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      setShowModal(true);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleComparison(movie);
  };

  return (
    <>
      <Link to={`/movie/${movie.id}`} className={styles.card}>
        <div className={styles.poster}>
          {movie.poster?.previewUrl || movie.poster?.url ? (
            <img
              src={movie.poster.previewUrl ?? movie.poster.url}
              alt={movie.name}
              loading="lazy"
            />
          ) : (
            <div className={styles.noPoster}>
              <span>🎬</span>
              <span>Нет постера</span>
            </div>
          )}

          {rating && ratingRaw != null && (
            <div className={styles.rating} style={{ color: getRatingColor(ratingRaw) }}>
              ★ {rating}
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${isFavorite(movie.id) ? styles.favActive : ''}`}
              onClick={handleFavClick}
              title={isFavorite(movie.id) ? 'Убрать из избранного' : 'В избранное'}
            >
              {isFavorite(movie.id) ? '❤️' : '🤍'}
            </button>
            <button
              className={`${styles.actionBtn} ${inComparison(movie.id) ? styles.compActive : ''}`}
              onClick={handleCompareClick}
              title={inComparison(movie.id) ? 'Убрать из сравнения' : 'Добавить к сравнению'}
            >
              ⚖️
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{movie.name}</h3>
          {movie.year != null && <span className={styles.year}>{movie.year}</span>}
        </div>
      </Link>

      {showModal && (
        <Modal
          title="Добавить в избранное"
          message={`Добавить «${movie.name}» в список избранного?`}
          onConfirm={() => { addFavorite(movie); setShowModal(false); }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
