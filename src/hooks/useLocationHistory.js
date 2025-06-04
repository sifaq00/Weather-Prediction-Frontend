import { useState, useEffect } from 'react';

const HISTORY_KEY = 'location_history';
const FAVORITES_KEY = 'location_favorites';
const MAX_HISTORY_ITEMS = 10;

export function useLocationHistory() {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load history and favorites from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save history and favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const saveHistory = (newHistory) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addToHistory = (location) => {
    const newLocation = {
      ...location,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [
      newLocation,
      ...history.filter(
        (item) => item.lat !== location.lat || item.lng !== location.lng
      ),
    ].slice(0, MAX_HISTORY_ITEMS); // Keep only the last 10 locations

    saveHistory(newHistory);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const removeFromHistory = (location) => {
    const newHistory = history.filter(
      (item) => item.lat !== location.lat || item.lng !== location.lng
    );
    saveHistory(newHistory);
  };

  const toggleFavorite = (location) => {
    const isFavorite = favorites.some(
      (item) => item.lat === location.lat && item.lng === location.lng
    );

    if (isFavorite) {
      const newFavorites = favorites.filter(
        (item) => item.lat !== location.lat || item.lng !== location.lng
      );
      saveFavorites(newFavorites);
    } else {
      const newLocation = {
        ...location,
        timestamp: new Date().toISOString(),
      };
      saveFavorites([newLocation, ...favorites]);
    }
  };

  const removeFavorite = (location) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (item) => item.lat !== location.lat || item.lng !== location.lng
      )
    );
  };

  const isFavorite = (location) => {
    return favorites.some(
      (item) => item.lat === location.lat && item.lng === location.lng
    );
  };

  return {
    history,
    favorites,
    addToHistory,
    clearHistory,
    removeFromHistory,
    toggleFavorite,
    removeFavorite,
    isFavorite,
  };
} 