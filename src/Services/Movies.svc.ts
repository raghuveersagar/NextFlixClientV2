import type { MovieSearchResult } from '../Model/MovieSearchResult';

export const fetchMovieSuggestions = async (query: string, page: number = 1): Promise<MovieSearchResult> => {
  if (!query.trim()) return { results: [], page: 1, total_pages: 0 };

  try {
    const movieUrl = `http://localhost:3000/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(movieUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }  
    const resp = await response.json();
    return {
      results: resp?.results || [],
      page: resp?.page || 1,
      total_pages: resp?.total_pages || 1
    };
  } catch (error) {
    console.error('Error fetching movie suggestions:', error);
    throw error;
  }
};

export const fetchMovieSuggestionsWithDiscover = async (query: string = '', page: number = 1): Promise<MovieSearchResult> => {
  try {
    let movieUrl = `http://localhost:3000/api/movies/discover?page=${page}`;
    if (query.trim()) {
      movieUrl += `&q=${encodeURIComponent(query)}`;
    }
    const response = await fetch(movieUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resp = await response.json();
    return {
      results: resp?.results || [],
      page: resp?.page || 1,
      total_pages: resp?.total_pages || 1
    };
  } catch (error) {
    console.error('Error fetching movie suggestions with discover:', error);
    throw error;
  }
};

export const getRecommendations = async (movieId: number, page: number = 1): Promise<MovieSearchResult> => {
  try {
    const movieUrl = `http://localhost:3000/api/movies/${movieId}/recommendations?page=${page}`;
    const response = await fetch(movieUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resp = await response.json();
    return {
      results: resp?.results || [],
      page: resp?.page || 1,
      total_pages: resp?.total_pages || 1
    };
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    throw error;
  }
};