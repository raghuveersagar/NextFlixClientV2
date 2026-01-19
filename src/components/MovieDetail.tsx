import { useParams, useLocation } from 'react-router-dom';
import '../Styles/MovieDetail.css';
import type { Movie } from '../Model/Movie';
import noPosterImage from '../assets/no-poster.svg';

function MovieDetail() {
  const { movieId } = useParams<{ movieId: string }>();
  const location = useLocation();
  const movie = location.state?.movie as Movie | undefined;

  return (
    <div className="movie-detail">
      <div className="movie-detail-content">
        <img 
          src={movie?.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : noPosterImage
          } 
          alt={movie?.title || 'Movie poster'}
          className="movie-detail-poster"
        />
        <div className="movie-detail-info">
          <h2>{movie?.title || `Movie ID: ${movieId}`}</h2>
          <p>Movie recommendations based on your selection will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;