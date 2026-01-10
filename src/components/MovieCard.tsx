import './MovieCard.css';

interface MovieCardProps {
  title: string;
  posterUrl: string;
}

function MovieCard({ title, posterUrl }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={title} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
      </div>
    </div>
  );
}

export default MovieCard;