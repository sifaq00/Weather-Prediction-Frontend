"use client";
import React, { useState } from 'react';
import { UserIcon, LogInIcon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/LOGO.png';

const NavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-sky-500' : 'text-gray-600 hover:text-sky-500'
      }`}
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 transform transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
    />
  </Link>
);

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
      <nav
        className="sticky top-0 w-full z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3
                   bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/80"
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            className="w-10 h-10 object-contain rounded-full"
            alt="WeatherWise logo"
          />
          <span className="text-xl font-bold tracking-tight text-sky-600">WeatherWise</span>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              isActive={location.pathname === link.path}
              onClick={handleLinkClick}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            <LogInIcon className="w-4 h-4" />
            Login
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold shadow-md hover:bg-sky-600 transition-all duration-200 transform hover:scale-105">
            <UserIcon className="w-4 h-4" />
            Register
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 transition">
            {isMenuOpen ? <X className="w-6 h-6 text-sky-600" /> : <Menu className="w-6 h-6 text-sky-600" />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-2xl font-semibold ${location.pathname === link.path ? 'text-sky-500' : 'text-gray-700 hover:text-sky-500'
                }`}
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-4 w-4/5 max-w-xs">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-lg font-semibold bg-gray-100 text-gray-800">
              <LogInIcon className="w-5 h-5" />
              Login
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-sky-500 text-white text-lg font-semibold">
              <UserIcon className="w-5 h-5" />
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}