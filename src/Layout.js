import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="sidebar">
        <h2>AgriMind</h2>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/weatherpage">WeatherPage</Link>
          <Link to="/fieldmappage">Field Map</Link>
          <Link to="/riskdashboard">Risk Dashboard</Link>
          <Link to="/chatbotpage">AI Assistant</Link>
          <Link to="/pestdetection">Pest Detection</Link>
          <Link to="/analyticspage">Analytics</Link>
        </nav>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
