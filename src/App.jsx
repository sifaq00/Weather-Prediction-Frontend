import { Routes, Route, useLocation } from 'react-router-dom'; 

import { Navbar } from './components/Navbar';
import Hero from './Pages/HomePage/Hero';
import { Features } from './Pages/HomePage/Features';
import { Footer } from './components/Footer';
import { PredictPage } from './Pages/PredictionPage/PredictPage';
import { WeeklyForecastPage } from './Pages/PredictionPage/WeeklyForecastPage';
import { HistoryPage } from './Pages/HistoryPage/HistoryPage';
import { AboutPage } from './Pages/AboutPage/AboutPage';
import { LoginPage } from './Pages/AuthPage/LoginPage';
import { RegisterPage } from './Pages/AuthPage/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="bg-white">
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={ <div> <Hero /> <Features /> </div> } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* BUNGKUS RUTE PRIVAT DENGAN PROTECTEDROUTE */}
          <Route path="/predict" element={
            <ProtectedRoute>
              <PredictPage />
            </ProtectedRoute>
          } />
          <Route path="/weekly-forecast" element={
            <ProtectedRoute>
              <WeeklyForecastPage />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />

        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;