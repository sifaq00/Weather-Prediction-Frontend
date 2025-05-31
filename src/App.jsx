// File: App.jsx (Versi Full-Width)

import React from 'react';
import { Navbar } from './components/Navbar';
import Hero from './Pages/HomePage/Hero';
import { Features } from './Pages/HomePage/Features';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <div className="bg-white">
      <Navbar />
      
      <main>
        <div>
          <Hero />
          <Features />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;