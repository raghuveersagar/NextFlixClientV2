import type { Movie } from '../Model/Movie';

interface RecommendationsProps {
  movie: Movie;
}

function Recommendations({ movie }: RecommendationsProps) {
  return (
    <div className="recommendations">
      <h2>Recommendations for "{movie.title}"</h2>
      <p>Recommendations will be displayed here.</p>
    </div>
  );
}

export default Recommendations;
