// Единая утилита рейтинга — используется во всём приложении

export function getRatingColor(value: number): string {
  if (value >= 7) return 'var(--success)';
  if (value >= 5) return 'var(--accent)';
  return 'var(--accent2)';
}

// Возвращает null если рейтинг 0 или отсутствует (API иногда отдаёт 0 вместо null)
export function formatRating(value: number | undefined | null): string | null {
  if (value == null || value === 0) return null;
  return value.toFixed(1);
}
