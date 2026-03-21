import axios from 'axios';
import type { Movie, MoviesResponse, Filters } from '../types';

const api = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4',
});

// Interceptor — ключ читается в момент запроса, а не при инициализации модуля.
// Это позволяет менять ключ через .env без перезапуска dev-сервера.
api.interceptors.request.use((config) => {
  config.headers['X-API-KEY'] = import.meta.env.VITE_KINOPOISK_API_KEY ?? '';
  return config;
});

export async function fetchMovies(page: number, filters: Filters): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: '50',
    'rating.kp': `${filters.ratingMin}-${filters.ratingMax}`,
    year: `${filters.yearMin}-${filters.yearMax}`,
    notNullFields: 'name',
    // Сортируем по рейтингу по умолчанию для лучшего UX
    sortField: 'rating.kp',
    sortType: '-1',
  });

  // API kinopoisk.dev принимает жанры как повторяющийся параметр
  filters.genres.forEach((g) => params.append('genres.name', g));

  const { data } = await api.get<MoviesResponse>(`/movie?${params.toString()}`);
  return data;
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movie/${id}`);
  return data;
}
