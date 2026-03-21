import { NavLink } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { favorites, comparison } = useAppContext();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <span className={`${styles.logoText} bebas`}>🎬 CineScope</span>
      </NavLink>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Фильмы
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          Избранное
          {favorites.length > 0 && (
            <span className={styles.badge}>{favorites.length}</span>
          )}
        </NavLink>

        {/* Ссылка на сравнение появляется только когда выбраны фильмы */}
        {comparison.length > 0 && (
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `${styles.link} ${styles.compareLink} ${isActive ? styles.active : ''}`
            }
          >
            Сравнение
            <span className={`${styles.badge} ${styles.badgeOrange}`}>
              {comparison.length}
            </span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}
