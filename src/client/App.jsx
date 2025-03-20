import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initSocket } from './socket';

// Pages
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Header from './components/layout/Header';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize socket connection
    initSocket(dispatch);
    
    // Clean up socket connection on unmount
    return () => {
      // Cleanup socket connection
    };
  }, [dispatch]);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:roomId/:playerName" element={<GamePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;