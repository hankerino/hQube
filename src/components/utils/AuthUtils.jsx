// Authentication utilities for new backend
import { api } from './ApiClient';

export const auth = {
  login: async () => {
    // Implement OAuth or redirect to auth provider
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/login`;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/';
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');
      
      const userData = await api.getCurrentUser();
      return userData;
    } catch (error) {
      throw new Error('User not authenticated');
    }
  },

  updateUserData: async (data) => {
    return await api.updateUser(data);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export default auth;