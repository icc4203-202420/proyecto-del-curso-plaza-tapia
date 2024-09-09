import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { user: { email, password } });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return;
    }

    const response = await axios.delete(`${API_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    localStorage.removeItem('user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
