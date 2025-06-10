// File: App.jsx (Versi Full-Width)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Hero from './Pages/HomePage/Hero';
import { Features } from './Pages/HomePage/Features';
import { Footer } from './components/Footer';
import { PredictPage } from './Pages/PredictionPage/PredictPage';
import { HistoryPage } from './Pages/HistoryPage/HistoryPage';
import { AboutPage } from './Pages/AboutPage/AboutPage';

function App() {
  return (
    <Router>
      <div className="bg-white">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <Hero />
                <Features />
              </div>
            } />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;