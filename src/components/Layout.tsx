import { Outlet, Link } from 'react-router-dom';
import '../Styles/App.css';

function Layout() {
  return (
    <div className="app">
      <div className="top-bar">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="logo-text">
            <span style={{ fontSize: '1.4em' }}>N</span>ext <span style={{ fontSize: '1.4em' }}>F</span>lix
          </h1>
          <p className="logo-subtitle">AI powered movie recommendations</p>
        </Link>
      </div>
      <main className="main-content">
        <Outlet />
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

export default Layout;
