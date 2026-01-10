import './App.css';
import MovieSearch from './components/MovieSearch';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>My next flix</h1>
        <p className="subheader">AI powered movie recommendations</p>
      </header>
      <main className="main-content">
        <MovieSearch />
      </main>
      <footer className="footer">
        <span>Created by Raghuveer Sagar</span>
        <span>Contact: raghuveer.sagar@example.com</span>
        <a href="https://linkedin.com/in/raghuveersagar" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </footer>
    </div>
  );
}

export default App;
