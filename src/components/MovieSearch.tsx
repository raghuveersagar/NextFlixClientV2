import { useState, useEffect, useRef } from 'react';
import '../Styles/MovieSearch.css';
import MovieCard from './MovieCard';
import SelectedMovie from './SelectedMovie';
import { fetchMovieSuggestionsWithDiscover } from '../Services/Movies.svc';
import type { Movie } from '../Model/Movie';
import { getLanguageName } from '../constants';
import noPosterImage from '../assets/no-poster.svg';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
    if (query.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        let result;
        result = await fetchMovieSuggestionsWithDiscover(query, currentPage);
        setSuggestions(result.results);
        setTotalPages(result.total_pages);
        setIsOpen(result.results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setQuery(movie.title);
    setIsOpen(false);
    setSelectedMovie(movie);
  };

  const handleGetRecommendations = (movie: Movie) => {
    // TODO: Implement get recommendations functionality
    console.log('Get recommendations for:', movie);

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

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setSelectedIndex(-1);
    }
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setSelectedIndex(-1);
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
          <div className="suggestions-dropdown">
            <ul className="suggestions-list">
              {suggestions.map((movie, index) => (
                  <li
                  key={movie.id}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectMovie(movie)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <img 
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : noPosterImage
                    } 
                    alt={movie.title}
                    className="suggestion-poster"
                    />
                  <div className="movie-info-text">
                    <span className="movie-title">{movie.title}</span>
                    <div className="movie-meta">
                      {movie.release_date && (
                        <span className="movie-year">{movie.release_date.substring(0, 4)}</span>
                      )}
                      {movie.original_language && (
                        <span className="movie-language">{getLanguageName(movie.original_language)}</span>
                      )}
                    </div>
                  </div>
                  </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  className="prev-page" 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="next-page" 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMovie && (
        <SelectedMovie 
          movie={selectedMovie} 
          onGetRecommendations={handleGetRecommendations} 
        />
      )}
      
      {false && (
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
