"use client";
import { useState } from 'react';
import PropTypes from 'prop-types'; 
import { UserIcon, LogInIcon, LogOutIcon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/LOGO.png';
import { useAuth } from '../context/AuthContext.jsx';
import { cn } from '../lib/utils';

// Komponen NavLink dengan gaya latar belakang untuk link aktif
const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-md",
        isActive 
            ? 'bg-sky-100 text-sky-600' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Predict", path: "/predict" },
    { name: "History", path: "/history" },
    { name: "About", path: "/about" }
  ];

  return (
    <>
      {/* Navbar sekarang selalu solid dengan latar belakang putih dan bayangan */}
      <nav
        className="sticky top-0 w-full z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/80"
      >
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10 object-contain rounded-full" alt="WeatherWise logo"/>
          {/* Warna teks logo sekarang selalu biru langit */}
          <span className="text-xl font-bold tracking-tight text-sky-600">
            Zenith
          </span>
        </div>

        <div className="hidden md:flex gap-2 items-center">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} isActive={location.pathname === link.path}>
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              {user && <span className="text-sm font-medium text-gray-700">Welcome, {user.username}!</span>}
              <button 
                onClick={logout} 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <LogInIcon className="w-4 h-4" />
                Login
              </Link>
              <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold shadow-md hover:bg-sky-600 transition-all duration-200 transform hover:scale-105">
                <UserIcon className="w-4 h-4" />
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <span className="text-sky-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className={`text-2xl font-semibold ${location.pathname === link.path ? 'text-sky-500' : 'text-gray-700 hover:text-sky-500'}`} onClick={handleLinkClick}>
              {link.name}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-4 w-4/5 max-w-xs">
            {isAuthenticated ? (
               <button onClick={() => { logout(); handleLinkClick(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-lg font-semibold bg-red-500 text-white">
                  <LogOutIcon className="w-5 h-5" />
                  Logout
               </button>
            ) : (
              <>
                <Link to="/login" onClick={handleLinkClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-lg font-semibold bg-gray-100 text-gray-800">
                  <LogInIcon className="w-5 h-5" />
                  Login
                </Link>
                <Link to="/register" onClick={handleLinkClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-sky-500 text-white text-lg font-semibold">
                  <UserIcon className="w-5 h-5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}