import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import styles from './ComparisonBar.module.css';

// Плавающая панель выбранных к сравнению фильмов
export function ComparisonBar() {
  const { comparison, toggleComparison, clearComparison } = useAppContext();

  if (comparison.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.films}>
        {comparison.map((m) => (
          <div key={m.id} className={styles.film}>
            {m.poster?.previewUrl ? (
              <img src={m.poster.previewUrl} alt={m.name} className={styles.thumb} />
            ) : (
              <div className={styles.thumbEmpty}>🎬</div>
            )}
            <span className={styles.name}>{m.name}</span>
            <button className={styles.remove} onClick={() => toggleComparison(m)}>✕</button>
          </div>
        ))}
        {comparison.length === 1 && (
          <div className={styles.slot}>+ выберите второй фильм</div>
        )}
      </div>

      <div className={styles.controls}>
        {comparison.length === 2 && (
          <Link to="/compare" className={styles.compareBtn}>Сравнить ⚖️</Link>
        )}
        <button className={styles.clearBtn} onClick={clearComparison}>Очистить</button>
      </div>
    </div>
  );
}
