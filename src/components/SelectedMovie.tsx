import '../Styles/SelectedMovie.css';
import type { Movie } from '../Model/Movie';
import noPosterImage from '../assets/no-poster.svg';

interface SelectedMovieProps {
  movie: Movie;
  onGetRecommendations: (movie: Movie) => void;
}

function SelectedMovie({ movie, onGetRecommendations }: SelectedMovieProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : noPosterImage;

  return (
    <div className="selected-movie">
      <div className="selected-movie-content">
        <div className="selected-movie-poster">
          <img src={posterUrl} alt={movie.title} />
        </div>
        <div className="selected-movie-info">
          <h2 className="selected-movie-title">{movie.title}</h2>
          <p className="selected-movie-plot">
            {movie.overview || 'No plot details available.'}
          </p>
          <button 
            className="show-similar-btn"
            onClick={() => onGetRecommendations(movie)}
          >
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectedMovie;
