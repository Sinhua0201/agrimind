import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div>
          <h2>AgriMind</h2>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/weatherpage">WeatherPage</Link>
            <Link to="/fieldmappage">Field Map</Link>
            <Link to="/riskdashboardpage">Risk Dashboard</Link>
            <Link to="/chatbotpage">AI Assistant</Link>
            <Link to="/pestdetection">Pest Detection</Link>
            <Link to="/analyticspage">Analytics</Link>
          </nav>
        </div>

        <div>
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
