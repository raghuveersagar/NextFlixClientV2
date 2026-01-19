import type { Movie } from './Movie';

export interface MovieSearchResult {
  results: Movie[];
  page: number;
  total_pages: number;
}