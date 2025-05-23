import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Layout from './Layout';
import Homepage from './components/homepage';
import Fieldmappage from './components/fieldmappage';
import Riskdashboardpage from './components/riskdashboardpage';
import Chatbotpage from './components/chatbotpage';
import Analyticspage from './components/analyticspage';
import PestDetectionPage from './components/pestdetection';
import WeatherPage from './components/weatherpage';
import AuthForm from './components/AuthForm';

function App() {
  const [user, setUser] = useState(undefined); // use undefined to indicate loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if not logged in
    });
    return () => unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (user === undefined) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* Auth Route - accessible by everyone */}
        <Route path="/auth" element={<AuthForm />} />

        {/* Protected Routes */}
        {user ? (
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/weatherpage" element={<WeatherPage />} />
                <Route path="/fieldmappage" element={<Fieldmappage />} />
                <Route path="/riskdashboard" element={<Riskdashboardpage />} />
                <Route path="/chatbotpage" element={<Chatbotpage />} />
                <Route path="/analyticspage" element={<Analyticspage />} />
                <Route path="/pestdetection" element={<PestDetectionPage />} />
              </Routes>
            </Layout>
          } />
        ) : (
          // Redirect all other routes to login
          <Route path="*" element={<Navigate to="/auth" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
