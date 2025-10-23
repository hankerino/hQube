// API configuration for new backend
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Authentication
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },

  // User management
  getMe: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('GetMe error:', error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      return await response.json();
    } catch (error) {
      console.error('UpdateUser error:', error);
      throw error;
    }
  },

  // Analysis Requests
  createAnalysis: async (analysisData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(analysisData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create analysis');
      }
      return await response.json();
    } catch (error) {
      console.error('CreateAnalysis error:', error);
      throw error;
    }
  },

  getAnalyses: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analyses');
      }
      return await response.json();
    } catch (error) {
      console.error('GetAnalyses error:', error);
      throw error;
    }
  },

  // Support Tickets
  createTicket: async (ticketData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }
      return await response.json();
    } catch (error) {
      console.error('CreateTicket error:', error);
      throw error;
    }
  },

  // Integrations
  invokeLLM: async (prompt, response_json_schema) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/integrations/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, response_json_schema }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'LLM invocation failed');
      }
      return await response.json();
    } catch (error) {
      console.error('InvokeLLM error:', error);
      throw error;
    }
  },

  sendEmail: async (to, subject, body, from_name) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/integrations/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ to, subject, body, from_name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Email sending failed');
      }
      return await response.json();
    } catch (error) {
      console.error('SendEmail error:', error);
      throw error;
    }
  },
};

export default api;