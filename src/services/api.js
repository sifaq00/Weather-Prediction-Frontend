import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (username, password) => {
  return api.post('/register', { username, password });
};

export const loginUser = (username, password) => {
  return api.post('/login', { username, password });
};

// Fungsi ini akan menyimpan ke riwayat
export const getPrediction = (features) => {
  return api.post('/predict', features);
};

// Fungsi ini TIDAK akan menyimpan ke riwayat
export const getPredictionNoSave = (features) => {
  return api.post('/predict-no-save', features);
};

export const getHistory = () => {
  return api.get('/history');
};

// BARU: Fungsi untuk mendapatkan profil user
export const getProfile = () => {
  return api.get('/profile');
};


export default api;