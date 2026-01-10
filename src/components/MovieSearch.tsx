import { useState, useEffect, useRef } from 'react';
import './MovieSearch.css';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  year: number;
}

// Placeholder function to simulate backend API call
const fetchMovieSuggestions = async (query: string): Promise<Movie[]> => {
  // TODO: Replace with actual backend API call
  // Example: return await fetch(`/api/movies/search?q=${query}`).then(res => res.json());
  
  // Simulated placeholder data
  const mockMovies: Movie[] = [
    { id: 1, title: 'The Shawshank Redemption', year: 1994 },
    { id: 2, title: 'The Godfather', year: 1972 },
    { id: 3, title: 'The Dark Knight', year: 2008 },
    { id: 4, title: 'Pulp Fiction', year: 1994 },
    { id: 5, title: 'Forrest Gump', year: 1994 },
    { id: 6, title: 'Inception', year: 2010 },
    { id: 7, title: 'The Matrix', year: 1999 },
    { id: 8, title: 'Interstellar', year: 2014 },
  ];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!query.trim()) return [];
  
  return mockMovies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

const featuredMovies = [
  { id: 1, title: 'The Shawshank Redemption', posterUrl: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg' },
  { id: 2, title: 'The Godfather', posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { id: 3, title: 'The Dark Knight', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 4, title: 'Pulp Fiction', posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { id: 5, title: 'Forrest Gump', posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
  { id: 6, title: 'Inception', posterUrl: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg' },
  { id: 7, title: 'The Matrix', posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
  { id: 8, title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 9, title: 'Fight Club', posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  { id: 10, title: 'Goodfellas', posterUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
];

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await fetchMovieSuggestions(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setQuery(movie.title);
    setIsOpen(false);
    // TODO: Call backend to get movie recommendations based on selection
    console.log('Selected movie:', movie);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectMovie(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="movie-search-wrapper">
      <div className="movie-search-container" ref={wrapperRef}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Type a movie you like"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          />
          {isLoading && <span className="loading-indicator">Loading...</span>}
        </div>
        
        {isOpen && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((movie, index) => (
              <li
                key={movie.id}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelectMovie(movie)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="movie-title">{movie.title}</span>
                <span className="movie-year">({movie.year})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="featured-movies">
        <h2 className="featured-title">Popular Movies</h2>
        <div className="movies-grid">
          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieSearch;
