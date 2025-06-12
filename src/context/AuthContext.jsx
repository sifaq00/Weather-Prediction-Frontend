import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, getProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        localStorage.setItem('access_token', token);
        try {
          const response = await getProfile();
          setUser(response.data); 
        } catch (error) {
          console.error("Gagal mengambil profil, token mungkin tidak valid", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('access_token');
        }
      } else {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogin = async (username, password) => {
    try {
      const response = await loginUser(username, password);
      setToken(response.data.access_token);
      navigate('/predict');
      return response;
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      throw error.response?.data || { error: 'Login failed!' };
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await registerUser(username, password);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      throw error.response?.data || { error: 'Registration failed!' };
    }
  };

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = {
    token,
    isAuthenticated: !!token,
    user, 
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};