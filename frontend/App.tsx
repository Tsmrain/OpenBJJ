import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Module Imports
import AppLayout from './src/modules/core/layout/AppLayout';
import WelcomeScreen from './src/modules/onboarding/screens/WelcomeScreen';
import LearnDashboard from './src/modules/learn/screens/LearnDashboard';
import BeltDetailView from './src/modules/learn/screens/BeltDetailView';
import TechniquePlayerView from './src/modules/learn/screens/TechniquePlayerView';
import VideoScreen from './src/modules/video/screens/VideoScreen';
import ProgressScreen from './src/modules/progress/screens/ProgressScreen';


const App: React.FC = () => {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Onboarding Module */}
          <Route path="/" element={<WelcomeScreen />} />

          {/* Core App Layout containing Learn, Analyze, etc. */}
          <Route element={<AppLayout />}>
            <Route path="/learn" element={<LearnDashboard />} />
            <Route path="/learn/:beltId" element={<BeltDetailView />} />
            <Route path="/learn/technique/:techniqueId" element={<TechniquePlayerView />} />

            {/* New Modules */}
            <Route path="/video" element={<VideoScreen />} />
            <Route path="/progress" element={<ProgressScreen />} />
            <Route path="/profile" element={<ProgressScreen />} /> {/* Redirect/Alias */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  );
};

export default App;