import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { MovieCard } from '../components/MovieCard';
import styles from './FavoritesPage.module.css';

export function FavoritesPage() {
  const { favorites } = useAppContext();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} bebas`}>Избранное</h1>
        <span className={styles.count}>{favorites.length} фильмов</span>
      </div>

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <span>🤍</span>
          <p>Список избранного пуст</p>
          <Link to="/" className={styles.link}>Перейти к каталогу</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
