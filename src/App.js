import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

import Homepage from './components/homepage';
import Fieldmappage from './components/fieldmappage';
import Riskdashboardpage from './components/riskdashboardpage';
import Chatbotpage from './components/chatbotpage';
import Analyticspage from './components/analyticspage';
import PestDetectionPage from './components/pestdetection';
import WeatherPage from './components/weatherpage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/weatherpage" element={< WeatherPage/>} />
          <Route path="/fieldmappage" element={<Fieldmappage />} />
          <Route path="/riskdashboard" element={<Riskdashboardpage />} />
          <Route path="/chatbotpage" element={<Chatbotpage />} />
          <Route path="/analyticspage" element={<Analyticspage />} />
          <Route path="/pestdetection" element={<PestDetectionPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
