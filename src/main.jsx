import '@fontsource/inter/index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';      
import App from './App';
import './index.css';

AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>          
      <AuthProvider>  
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);