export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  release_date?: string;
}

export const fetchMovieSuggestions = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];

  try {
    const movieUrl = `http://localhost:3000/api/movies/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(movieUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }  
    const resp = await response.json();
    const results: Movie[] = resp?.results;
    return results;
  } catch (error) {
    console.error('Error fetching movie suggestions:', error);
    throw error;
  }
};