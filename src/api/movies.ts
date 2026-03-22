import axios from 'axios';
import type { Movie, MoviesResponse, Filters } from '../types';

const API_KEY = '4RY5295-3Z0MYKA-PFA5WWK-XSDVWQ1';

const api = axios.create({
  baseURL: 'https://api.kinopoisk.dev/v1.4',
  headers: {
    'X-API-KEY': API_KEY,
  },
});

export async function fetchMovies(page: number, filters: Filters): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: '50',
    'rating.kp': `${filters.ratingMin}-${filters.ratingMax}`,
    year: `${filters.yearMin}-${filters.yearMax}`,
    notNullFields: 'name',
    sortField: 'rating.kp',
    sortType: '-1',
  });

  filters.genres.forEach((g) => params.append('genres.name', g));

  const { data } = await api.get<MoviesResponse>(`/movie?${params.toString()}`);
  return data;
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movie/${id}`);
  return data;
}
