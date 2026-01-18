import '../Styles/MovieCard.css';
import noPosterImage from '../assets/no-poster.svg';

interface MovieCardProps {
  title: string;
  posterUrl: string;
}

function MovieCard({ title, posterUrl }: MovieCardProps) {
  const displayPosterUrl = posterUrl || noPosterImage;
  
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={displayPosterUrl} alt={title} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;