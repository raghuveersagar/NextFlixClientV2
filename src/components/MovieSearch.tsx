import { useState, useEffect, useRef } from 'react';
import '../Styles/MovieSearch.css';
import MovieCard from './MovieCard';
import SelectedMovie from './SelectedMovie';
import { fetchMovieSuggestions } from './Services';
import type { Movie } from './Services';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
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
      if (query.trim().length < 5) {
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
    setSelectedMovie(movie);
  };

  const handleShowSimilar = (movie: Movie) => {
    // TODO: Implement show similar functionality
    console.log('Show similar movies for:', movie.title);
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
                <img 
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                  alt={movie.title}
                  className="suggestion-poster"
                />
                <span className="movie-title">{movie.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMovie && (
        <SelectedMovie 
          movie={selectedMovie} 
          onShowSimilar={handleShowSimilar} 
        />
      )}
      
      {suggestions.length > 0 && (
        <div className="featured-movies">
          <h2 className="featured-title">Suggested Movies</h2>
          <div className="movies-grid">
            {suggestions.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                posterUrl={`https://image.tmdb.org/t/p/w500/${movie.id}.jpg`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
