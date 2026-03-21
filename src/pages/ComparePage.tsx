import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { getRatingColor, formatRating } from '../utils/rating';
import type { Movie } from '../types';
import styles from './ComparePage.module.css';

function RatingCell({ movie }: { movie: Movie }) {
  const raw = movie.rating?.kp ?? movie.rating?.imdb;
  const formatted = formatRating(raw);
  if (!formatted || raw == null) return <span className={styles.na}>—</span>;
  return <span style={{ color: getRatingColor(raw), fontWeight: 700 }}>★ {formatted}</span>;
}

type Row = { label: string; a: React.ReactNode; b: React.ReactNode };

function buildRows(a: Movie, b: Movie): Row[] {
  return [
    { label: 'Название',     a: a.name,  b: b.name },
    { label: 'Год выпуска',  a: a.year ?? '—',  b: b.year ?? '—' },
    { label: 'Рейтинг КП',   a: <RatingCell movie={a} />, b: <RatingCell movie={b} /> },
    {
      label: 'Жанры',
      a: a.genres?.map((g) => g.name).join(', ') || '—',
      b: b.genres?.map((g) => g.name).join(', ') || '—',
    },
    {
      label: 'Длительность',
      a: a.movieLength != null ? `${a.movieLength} мин` : '—',
      b: b.movieLength != null ? `${b.movieLength} мин` : '—',
    },
  ];
}

export function ComparePage() {
  const { comparison, clearComparison } = useAppContext();

  if (comparison.length < 2) {
    return (
      <div className={styles.notReady}>
        <span>⚖️</span>
        <p>Выберите 2 фильма для сравнения</p>
        <Link to="/" className={styles.link}>Перейти к каталогу</Link>
      </div>
    );
  }

  const [a, b] = comparison;
  const rows = buildRows(a, b);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} bebas`}>Сравнение фильмов</h1>
        <button className={styles.clearBtn} onClick={clearComparison}>Очистить</button>
      </div>

      <div className={styles.posters}>
        <div className={styles.posterSlot} />
        {[a, b].map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`} className={styles.posterWrap}>
            {m.poster?.url ? (
              <img
                src={m.poster.previewUrl ?? m.poster.url}
                alt={m.name}
                className={styles.poster}
              />
            ) : (
              <div className={styles.noPoster}>🎬</div>
            )}
            <span className={styles.posterTitle}>{m.name}</span>
          </Link>
        ))}
      </div>

      <div className={styles.table}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <div className={styles.rowLabel}>{row.label}</div>
            <div className={styles.rowCell}>{row.a}</div>
            <div className={styles.rowCell}>{row.b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
