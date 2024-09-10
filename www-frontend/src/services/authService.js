import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { user: { email, password } });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('User logged in');
      localStorage.removeItem('token');
      return;
    }
    return;
  } catch (error) {
    throw error;
  }
};

export const getCurrentToken = () => {
  return localStorage.getItem('token');
};
