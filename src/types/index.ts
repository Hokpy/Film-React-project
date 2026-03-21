// Основные типы данных приложения

export interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  year?: number;
  rating: {
    kp?: number;
    imdb?: number;
  };
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  description?: string;
  shortDescription?: string;
  genres?: { name: string }[];
  movieLength?: number;
  type?: string;
}

export interface MoviesResponse {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Filters {
  genres: string[];
  ratingMin: number;
  ratingMax: number;
  yearMin: number;
  yearMax: number;
}

// Список жанров для фильтра
export const GENRES = [
  'аниме', 'биография', 'боевик', 'вестерн', 'документальный',
  'драма', 'история', 'комедия', 'криминал', 'мелодрама',
  'мультфильм', 'мюзикл', 'приключения', 'семейный', 'спорт',
  'триллер', 'ужасы', 'фантастика', 'фэнтези',
];

export const CURRENT_YEAR = new Date().getFullYear();
